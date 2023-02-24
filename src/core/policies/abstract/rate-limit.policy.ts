import { PolicieRateLimit } from "../../../interfaces/policies";
import { ICache, IRateLimitCache } from "../../../interfaces/cache";
import { RATE_LIMIT_ONE_HIT } from "../../constants";
import { requestRemainingCalculations } from "../../calculations/request-remaining.calculations";
import { retryAfterCalculations } from "../../calculations/retry-after.calculations";
import { timeWaitingCalculations } from "../../calculations/time-waiting.calculations";

export abstract class RateLimitPolicy {
  protected policySettings: PolicieRateLimit;
  protected responseRateLimitCache: IRateLimitCache;
  protected repositoryCache: ICache;

  /**
   * This model. All new policy classes must extend this class.
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   * @param {ICache} repositoryCache repository cache
   */
  constructor(
    policySettings: PolicieRateLimit,
    responseRateLimitCache: IRateLimitCache,
    repositoryCache: ICache
  ) {
    this.responseRateLimitCache = responseRateLimitCache;
    this.repositoryCache = repositoryCache;
    this.policySettings = policySettings;
  }

  /**
   * This model to calculate when the rate-limit reset. It must be implemented  in new policy classes
   * @abstract
   * @return {number} in milisseconds
   */
  public abstract whenTimeRateLimitReset(): number;

  /**
   * This model for property validations. It must implemented  in new policy classes
   * @abstract
   * @return {RateLimitPolicy} this
   */
  public abstract validateProps(): RateLimitPolicy;

  /**
   * Get amount request remaining
   * @return {number}
   */
  public amountRequestRemaining(): number {
    return requestRemainingCalculations(
      this.policySettings?.maxRequests,
      this.responseRateLimitCache?.hits
    );
  }

  /**
   * Get seconds wait to Retry After
   * @return {number} retry after in seconds
   */
  public timeWaitToRetryAfter(): number {
    const nextWindow = this.whenTimeRateLimitReset();

    return retryAfterCalculations(nextWindow);
  }

  /**
   * Check if waiting time is expired
   * @returns {boolean}
   */
  public waitingTimeIsExpired(): boolean {
    const timestampNow = Date.now();
    const timeRetryInSeconds = this.timeWaitToRetryAfter();

    const timeWaitting = timeWaitingCalculations(
      this.responseRateLimitCache?.last_time_request,
      timeRetryInSeconds
    );

    return timestampNow > timeWaitting;
  }

  /**
   * Save or Delete Hit
   * @param {string} key
   */
  public async saveHit(key: string): Promise<void> {
    // If don't exists cache then save with value hit as ONE
    if (!this.responseRateLimitCache?.hits) {
      await this.repositoryCache?.saveHit(key, RATE_LIMIT_ONE_HIT);
    } else {
      let totalHitsInCache = this.responseRateLimitCache?.hits;

      // if the number max requests is more or equal to the number of hits registered in the cache then update 'hit'.
      if (this.policySettings?.maxRequests >= totalHitsInCache) {
        const newValue = (totalHitsInCache += RATE_LIMIT_ONE_HIT);
        await this.repositoryCache?.updateHit(key, newValue);
      }
    }

    // if time wait is expired then delete hit cache
    if (this.waitingTimeIsExpired()) {
      await this.repositoryCache?.deleteHit(key);
    }
  }
}
