import { IPolicieRateLimit } from "../../../interfaces/policies";
import { IResponseHit } from "../../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND } from "../../../constants/application";

export abstract class RateLimitPolicy {
  protected policy: IPolicieRateLimit;
  protected responseHit: IResponseHit;

  public setResponseHit(responseHit: IResponseHit): RateLimitPolicy {
    this.responseHit = responseHit;
    return this;
  }

  public setPolicy(policy: IPolicieRateLimit): RateLimitPolicy {
    this.policy = policy;

    return this;
  }

  public getPolicy() {
    return this.policy;
  }

  public getResponseHit() {
    return this.responseHit;
  }

  public abstract calculateRateLimitWindow(): number;

  public abstract validateProps(): RateLimitPolicy;

  public calculateRemaning(): number {
    const hits = this.responseHit?.hits;
    const diffHitsRemaning = this.policy?.maxRequests - hits;

    return diffHitsRemaning;
  }

  public calculateRetryAfter() {
    const now = Date.now();
    const nextWindow = this.calculateRateLimitWindow();
    const diff = nextWindow - now;

    const timeWaitInSeconds = Math.ceil(diff / ONE_SECOND_IN_MILLISECOND);

    return timeWaitInSeconds;
  }
}
