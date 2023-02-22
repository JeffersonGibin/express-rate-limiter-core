import { PolicieRateLimit } from "../../../interfaces/policies";
import { ONE_SECOND_IN_MILLISECOND } from "../../../constants/time";

export abstract class RateLimitPolicy {
  protected policy: PolicieRateLimit;
  protected hits: number;

  /**
   * It represents a model that new policy classes must extend
   * @param  {number} totalHits amount total hits registred in the cache
   */
  constructor(totalHits: number) {
    this.hits = totalHits;
  }

  /**
   * It's an abstract model to calculate the rate limit reset. It must be implemented  in new policy classes
   * @return {number} the return must to be in milisseconds
   */
  public abstract calculateRateLimitReset(): number;

  /**
   * It's an abstract model for property validations. It must implemented  in new policy classes
   * @return {number} the return must to be in milisseconds
   */
  public abstract validateProps(): RateLimitPolicy;

  /**
   * Calculation the Request Remaining
   * @return {number} requests remaining in integer
   */
  public calculateRemaining(): number {
    const hits = this.hits;
    const diffHitsRemaning = this.policy?.maxRequests - hits;

    return diffHitsRemaning;
  }

  /**
   * Calculation the time "retry after"
   * @return {number} retry after in in milisseconds
   */
  public calculateRetryAfter(): number {
    const now = Date.now();
    const nextWindow = this.calculateRateLimitReset();
    const diff = nextWindow - now;

    const timeWaitInSeconds = Math.ceil(diff / ONE_SECOND_IN_MILLISECOND);

    return timeWaitInSeconds;
  }
}
