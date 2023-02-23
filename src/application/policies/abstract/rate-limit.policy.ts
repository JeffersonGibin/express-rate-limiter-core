import { PolicieRateLimit } from "../../../interfaces/policies";
import { ONE_SECOND_IN_MILLISECOND } from "../../../constants/time";
import { ICache, IRateLimitCache } from "../../../interfaces/cache";
import { RATE_LIMIT_ONE_HIT } from "../../../constants";

export abstract class RateLimitPolicy {
  protected policySettings: PolicieRateLimit;
  protected cacheAdapter: ICache;
  protected responseRateLimitCache: IRateLimitCache;

  /**
   * It represents a model that new policy classes must extend */
  constructor(responseRateLimitCache: IRateLimitCache) {
    this.responseRateLimitCache = responseRateLimitCache;
  }

  /**
   * It's an abstract model to calculate the rate limit reset. It must be implemented  in new policy classes
   * @return {number} the return must to be in milisseconds
   */
  public abstract calculateRateLimitReset(): number;

  /**
   * It's an abstract model for property validations. It must implemented  in new policy classes
   * @return {RateLimitPolicy} this
   */
  public abstract validateProps(): RateLimitPolicy;

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
   * Calculation the Request Remaining
   * @return {number} requests remaining in integer
   */
  public calculateRemaining(): number {
    const hits = this.responseRateLimitCache?.hits;
    const diffHitsRemaning = this.policySettings?.maxRequests - hits;

    return diffHitsRemaning;
  }

  /**
   * Calculation the time "retry after"
   * @return {number} retry after in seconds
   */
  public calculateRetryAfter(): number {
    const now = Date.now();
    const nextWindow = this.calculateRateLimitReset();
    const diff = nextWindow - now;

    const timeWaitInSeconds = Math.ceil(diff / ONE_SECOND_IN_MILLISECOND);

    return timeWaitInSeconds;
  }

  /**
   * Calculation the time is expired
   * @returns
   */
  public waitingTimeIsExpired(): boolean {
    const timestampNow = Date.now();
    const lastTimeRequestInMilissecond =
      this.responseRateLimitCache?.last_time_request;

    const timeRetryInSeconds = this.calculateRetryAfter();

    // TIME_RETRY_IN_SECONDS * 1000
    const timeWaitInMilliseconds =
      timeRetryInSeconds * ONE_SECOND_IN_MILLISECOND;

    // TIMESTAMP_LAST_REQUEST + TIME_WAIT
    const waitTime = lastTimeRequestInMilissecond + timeWaitInMilliseconds;

    return timestampNow > waitTime;
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
