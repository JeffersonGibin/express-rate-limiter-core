import { PolicieRateLimit } from "../../../interfaces/policies";
import { ONE_SECOND_IN_MILLISECOND } from "../../../constants/time";

export abstract class RateLimitPolicy {
  protected policy: PolicieRateLimit;
  protected hits: number;

  constructor(hits: number) {
    this.hits = hits;
  }

  public abstract calculateRateLimitReset(): number;

  public abstract validateProps(): RateLimitPolicy;

  public calculateRemaning(): number {
    const hits = this.hits;
    const diffHitsRemaning = this.policy?.maxRequests - hits;

    return diffHitsRemaning;
  }

  public calculateRetryAfter() {
    const now = Date.now();
    const nextWindow = this.calculateRateLimitReset();
    const diff = nextWindow - now;

    const timeWaitInSeconds = Math.ceil(diff / ONE_SECOND_IN_MILLISECOND);

    return timeWaitInSeconds;
  }
}
