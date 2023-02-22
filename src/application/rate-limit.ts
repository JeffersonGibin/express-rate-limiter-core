import { ICache, IRateLimitCache } from "../interfaces/cache";
import { RATE_LIMIT_ONE_HIT, ONE_SECOND_IN_MILLISECOND } from "../constants";
import { PolicieRateLimit } from "../interfaces/policies";

export class RateLimit {
  private policy: PolicieRateLimit;
  private responseHit: IRateLimitCache;
  private cacheAdapter: ICache;
  private key: string;

  constructor(key: string, policy: PolicieRateLimit) {
    this.key = key;
    this.policy = policy;
  }

  public setAdapter(cacheAdapter: ICache): RateLimit {
    this.cacheAdapter = cacheAdapter;
    return this;
  }

  public save() {
    const key = this.key;
    const timestampNow = Date.now();

    this.responseHit = this.cacheAdapter?.getByKey(key);
    const waitTime = this.policy?.maxRequests * ONE_SECOND_IN_MILLISECOND;

    if (!this.responseHit?.hits) {
      this.cacheAdapter?.saveHit(key, RATE_LIMIT_ONE_HIT);
    } else {
      // insert cache
      let totalHitsInCache = this.responseHit?.hits;
      if (this.policy?.maxRequests >= totalHitsInCache) {
        const newValue = (totalHitsInCache += RATE_LIMIT_ONE_HIT);
        this.cacheAdapter?.saveHit(key, newValue);
      }
    }

    const lastTimeInMilissecond = this.responseHit?.last_time;
    const timeSinceLastRequest = timestampNow - lastTimeInMilissecond;

    if (timeSinceLastRequest > waitTime) {
      this.cacheAdapter?.deleteHit(key);
    }
  }
}
