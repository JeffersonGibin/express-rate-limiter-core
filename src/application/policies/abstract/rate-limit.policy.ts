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
  public saveHit(key: string): void {
    // If don't exists cache then save with value ONE
    if (!this.responseRateLimitCache?.hits) {
      this.cacheAdapter?.saveHit(key, RATE_LIMIT_ONE_HIT);
    } else {
      // insert cache
      let totalHitsInCache = this.responseRateLimitCache?.hits;
      if (this.policySettings?.maxRequests >= totalHitsInCache) {
        const newValue = (totalHitsInCache += RATE_LIMIT_ONE_HIT);
        this.cacheAdapter?.updateHit(key, newValue);
      }
    }

    if (this.waitingTimeIsExpired()) {
      this.cacheAdapter?.deleteHit(key);
    }
  }
}
