import { ICache, IRateLimitCache } from "../interfaces/cache";
import { RATE_LIMIT_ONE_HIT, ONE_SECOND_IN_MILLISECOND } from "../constants";
import { PolicieRateLimit } from "../interfaces/policies";

export class RateLimit {
  private policySettings: PolicieRateLimit;
  private responseHit: IRateLimitCache;
  private cacheAdapter: ICache;
  private key: string;
  private timeRetryInSeconds: number;

  /**
   * Hits of Rate limit
   * @param {string} key key of cache
   * @param policySettings
   */
  constructor(key: string, policySettings: PolicieRateLimit) {
    this.key = key;
    this.policySettings = policySettings;
  }

  /**
   * Set cache adapter
   * @param cacheAdapter instance of adapter cache
   * @returns {RateLimit} this
   */
  public setAdapter(cacheAdapter: ICache): RateLimit {
    this.cacheAdapter = cacheAdapter;
    return this;
  }

  /**
   * Set cache adapter
   * @param cacheAdapter instance of adapter cache
   * @returns {RateLimit} this
   */
  public setTimeRetry(timeRetryInSeconds: number): RateLimit {
    this.timeRetryInSeconds = timeRetryInSeconds;
    return this;
  }

  private timeExpiration(): boolean {
    const timestampNow = Date.now();
    const lastTimeRequestInMilissecond = this.responseHit?.last_time_request;

    // TIME_RETRY_IN_SECONDS * 1000
    const timeWaitInMilliseconds =
      this.timeRetryInSeconds * ONE_SECOND_IN_MILLISECOND;

    // TIMESTAMP_LAST_REQUEST + TIME_WAIT
    const waitTime = lastTimeRequestInMilissecond + timeWaitInMilliseconds;

    return timestampNow > waitTime;
  }

  /**
   * Save Hit inthe cache
   */
  public save() {
    const key = this.key;

    this.responseHit = this.cacheAdapter?.getByKey(key);
    // const waitTime =
    //   this.policySettings?.maxRequests * ONE_SECOND_IN_MILLISECOND;

    // If don't exists cache then save with value ONE
    if (!this.responseHit?.hits) {
      this.cacheAdapter?.saveHit(key, RATE_LIMIT_ONE_HIT);
    } else {
      // insert cache
      let totalHitsInCache = this.responseHit?.hits;
      if (this.policySettings?.maxRequests >= totalHitsInCache) {
        const newValue = (totalHitsInCache += RATE_LIMIT_ONE_HIT);
        this.cacheAdapter?.updateHit(key, newValue);
      }
    }

    if (this.timeExpiration()) {
      this.cacheAdapter?.deleteHit(key);
    }
  }
}
