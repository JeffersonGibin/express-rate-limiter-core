import { IRateLimitCache } from "../../interfaces/cache";
import { PolicieRateLimit } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { RateLimitPerMinutesPolicy } from "./rate-limit-per-minutes.policy";
import { RateLimitPerPeriodPolicy } from "./rate-limit-per-period.policy";
import { RateLimitPerSecondsPolicy } from "./rate-limit-per-seconds.policy";

export class PoliciesFactory {
  private policy: PolicieRateLimit;
  private responseHit: IRateLimitCache;

  /**
   * Simple Factory class to create new instances of  policies classes
   * @param {PolicieRateLimit} policy object value of settings library
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   */
  constructor(
    policy: PolicieRateLimit,
    responseRateLimitCache: IRateLimitCache
  ) {
    this.policy = policy;
    this.responseHit = responseRateLimitCache;
  }

  /**
   * Create an instance of super type RateLimitPolicy
   * @returns {RateLimitPolicy} instance
   */
  create(): RateLimitPolicy {
    if (this.policy.type === "REQUEST_PER_SECONDS") {
      return new RateLimitPerSecondsPolicy(this.policy, this.responseHit);
    }

    if (this.policy.type === "REQUEST_PER_MINUTES") {
      return new RateLimitPerMinutesPolicy(this.policy, this.responseHit);
    }

    if (this.policy.type === "REQUEST_PER_PERIOD") {
      return new RateLimitPerPeriodPolicy(this.policy, this.responseHit);
    }
  }
}
