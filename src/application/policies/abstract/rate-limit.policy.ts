import { PolicieRateLimit } from "../../../interfaces/policies";
import { ICache, IRateLimitCache } from "../../../interfaces/cache";
import { RATE_LIMIT_ONE_HIT } from "../../../constants";
import { timeWaitingCalculations } from "../../../application/calculations/time-waiting.calculations";
import { requestRemainingCalculations } from "../../../application/calculations/request-remaining.calculations";
import { retryAfterCalculations } from "../../../application/calculations/retry-after.calculations";

export abstract class RateLimitPolicy {
  protected policySettings: PolicieRateLimit;
  protected cacheAdapter: ICache;
  protected responseRateLimitCache: IRateLimitCache;

  /**
   * This model. All new policy classes must extend this class.
   * @param responseRateLimitCache
   */
  constructor(responseRateLimitCache: IRateLimitCache) {
    this.responseRateLimitCache = responseRateLimitCache;
  }

  /**
   * Set cache adapter
   * @param cacheAdapter instance of adapter cache
   * @returns {RateLimitPolicy} this
   */
  public setAdapter(cacheAdapter: ICache): RateLimitPolicy {
    this.cacheAdapter = cacheAdapter;
    return this;
  }

  /**
   * This model to calculate when the rate limit reset. It must be implemented  in new policy classes
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
      await this.cacheAdapter?.saveHit(key, RATE_LIMIT_ONE_HIT);
    } else {
      let totalHitsInCache = this.responseRateLimitCache?.hits;

      // if the number max requests is more or equal to the number of hits registered in the cache then update 'hit'.
      if (this.policySettings?.maxRequests >= totalHitsInCache) {
        const newValue = (totalHitsInCache += RATE_LIMIT_ONE_HIT);
        await this.cacheAdapter?.updateHit(key, newValue);
      }
    }

    // if time wait is expired then delete hit cache
    if (this.waitingTimeIsExpired()) {
      await this.cacheAdapter?.deleteHit(key);
    }
  }
}
