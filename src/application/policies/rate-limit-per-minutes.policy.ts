import { ICache, IRateLimitCache } from "../../interfaces/cache";
import { IPolicyRequestPerMinutes } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { ValidationHandler } from "../validations/validation-handler";
import { rateLimitResetCalculations } from "../calculations/rate-limit-reset.calculations";

export class RateLimitPerMinutesPolicy extends RateLimitPolicy {
  protected policySettings: IPolicyRequestPerMinutes;
  protected responseRateLimitCache: IRateLimitCache;

  /**
   * This class represent policies to rate-limit per minutes
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   * @param {ICache} repositoryCache repository cache
   */
  constructor(
    policy: IPolicyRequestPerMinutes,
    responseRateLimitCache: IRateLimitCache,
    repositoryCache: ICache
  ) {
    super(responseRateLimitCache, repositoryCache);

    this.policySettings = policy;
    this.responseRateLimitCache = responseRateLimitCache;
  }

  /**
   * Implementation of an abstract model of RateLimitPolicy.
   *  Must execute validations properties that the library receives in the instance.
   * @returns {RateLimitPerMinutesPolicy} return this
   */
  public validateProps(): RateLimitPerMinutesPolicy {
    // Validations properties
    new ValidationHandler([
      {
        propertyName: "periodWindow",
        value: this.policySettings?.periodWindow,
        validations: ["exists_property", "is_number"],
      },
      {
        propertyName: "maxRequests",
        value: this.policySettings?.maxRequests,
        validations: ["exists_property", "is_number"],
      },
      {
        propertyName: "type",
        value: this.policySettings?.type,
        validations: ["exists_property", "is_string"],
      },
    ]).execute();

    return this;
  }

  /**
   * Get rate-limit reset  value
   * Note: this is a implementation of an abstract model of calculateRateLimitReset.
   * @returns {number} time in milliseconds
   */
  public whenTimeRateLimitReset(): number {
    return rateLimitResetCalculations({
      periodWindowIn: "MINUTES",
      periodWindow: this.policySettings?.periodWindow,
      lastTimeRequestInMilliseconds:
        this.responseRateLimitCache?.last_time_request,
    });
  }
}
