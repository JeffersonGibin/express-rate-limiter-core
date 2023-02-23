import { ICache, IRateLimitCache } from "../../interfaces/cache";
import { PolicieRateLimit } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { RateLimitPerMinutesPolicy } from "./rate-limit-per-minutes.policy";
import { RateLimitPerPeriodPolicy } from "./rate-limit-per-period.policy";
import { RateLimitPerSecondsPolicy } from "./rate-limit-per-seconds.policy";

export class PoliciesFactory {
  private policy: PolicieRateLimit;
  private responseRateLimitCache: IRateLimitCache;
  private repositoryCache: ICache;

  /**
   * Simple Factory class to create new instances of  policies classes
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   */
  constructor(
    policySettings: PolicieRateLimit,
    responseRateLimitCache: IRateLimitCache,
    repositoryCache: ICache
  ) {
    this.policy = policySettings;
    this.responseRateLimitCache = responseRateLimitCache;
    this.repositoryCache = repositoryCache;
  }

  /**
   * Create an instance of super type RateLimitPolicy
   * @returns {RateLimitPolicy} instance
   */
  create(): RateLimitPolicy {
    if (this.policy.type === "REQUEST_PER_SECONDS") {
      return new RateLimitPerSecondsPolicy(
        this.policy,
        this.responseRateLimitCache,
        this.repositoryCache
      );
    }

    if (this.policy.type === "REQUEST_PER_MINUTES") {
      return new RateLimitPerMinutesPolicy(
        this.policy,
        this.responseRateLimitCache,
        this.repositoryCache
      );
    }

    if (this.policy.type === "REQUEST_PER_PERIOD") {
      return new RateLimitPerPeriodPolicy(
        this.policy,
        this.responseRateLimitCache,
        this.repositoryCache
      );
    }
  }
}
