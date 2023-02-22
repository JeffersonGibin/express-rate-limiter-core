import {
  Request as IExpressRequest,
  Response as IExpressResponse,
  NextFunction as INextFunction,
} from "express";
import { ICache, IResponseHit } from "../interfaces/cache";
import { ONE_HIT, ONE_SECOND_IN_MILLISECOND } from "../constants/application";
import { IPolicieRateLimit } from "../interfaces/policies";
import { RateLimitPolicy } from "./policies/abstract/rate-limit.policy";

export class RateLimit {
  protected policyInstance: RateLimitPolicy;
  protected policy: IPolicieRateLimit;
  protected request: IExpressRequest;
  protected response: IExpressResponse;
  protected next: INextFunction;

  protected responseHit: IResponseHit;
  protected cacheAdapter: ICache;

  public setAdapter(cacheAdapter: ICache): RateLimit {
    this.cacheAdapter = cacheAdapter;
    return this;
  }

  public setPolicy(policy: IPolicieRateLimit): RateLimit {
    this.policy = policy;

    return this;
  }

  public setRequest(
    req: IExpressRequest,
    res: IExpressResponse,
    next: INextFunction
  ): RateLimit {
    this.request = req;
    this.response = res;
    this.next = next;

    return this;
  }

  public processIncrementOrDeleteHits() {
    const ip = this.request?.ip;
    const timestampNow = Date.now();

    this.responseHit = this.cacheAdapter?.getByKey(ip);
    const lastTimeInMilissecond = this.responseHit?.last_time ?? timestampNow;

    const timeSinceLastRequest = timestampNow - lastTimeInMilissecond;
    const waitTime = this.policy?.maxRequests * ONE_SECOND_IN_MILLISECOND;

    if (!this.responseHit?.hits) {
      this.cacheAdapter?.saveHit(ip, ONE_HIT);
    } else {
      // insert cache
      let totalHitsInCache = this.responseHit?.hits;
      if (this.policy?.maxRequests >= totalHitsInCache) {
        const newValue = (totalHitsInCache += ONE_HIT);
        this.cacheAdapter?.saveHit(ip, newValue);
      }
    }

    if (timeSinceLastRequest > waitTime) {
      this.cacheAdapter?.deleteHit(ip);
    }
  }
}
