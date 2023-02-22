import { IRateLimitCache } from "../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND, SIXTY_SECONDS } from "../../constants";
import { IPolicyRequestPerMinutes } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { ValidationHandler } from "../validations/validation-handler";

export class RateLimitPerMinutesPolicy extends RateLimitPolicy {
  protected policySettings: IPolicyRequestPerMinutes;
  protected responseRateLimitCache: IRateLimitCache;

  /**
   * This class represent policies to rate limit per minutes
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   */
  constructor(policy: IPolicyRequestPerMinutes, responseHit: IRateLimitCache) {
    super(responseHit?.hits);
    this.policySettings = policy;
    this.responseRateLimitCache = responseHit;
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
   * Implementation of an abstract model of calculateRateLimitReset.
   * @returns {RateLimitPerMinutesPolicy} return this
   */
  public calculateRateLimitReset(): number {
    const timeWaitInMilliseconds =
      this.policySettings?.periodWindow *
      SIXTY_SECONDS *
      ONE_SECOND_IN_MILLISECOND;

    const lastTimeCacheInMilliseconds = this.responseRateLimitCache?.last_time;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
