import { IRateLimitCache } from "../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND } from "../../constants";
import { IPolicyRequestPerSeconds } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { ValidationHandler } from "../validations/validation-handler";

export class RateLimitPerSecondsPolicy extends RateLimitPolicy {
  protected policySettings: IPolicyRequestPerSeconds;
  protected responseRateLimitCache: IRateLimitCache;

  /**
   * This class represent policies to rate limit per seconds
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   */
  constructor(
    policySettings: IPolicyRequestPerSeconds,
    responseRateLimitCache: IRateLimitCache
  ) {
    super(responseRateLimitCache?.hits);
    this.policySettings = policySettings;
    this.responseRateLimitCache = responseRateLimitCache;
  }

  /**
   * Implementation of an abstract model of RateLimitPolicy.
   *  Must execute validations properties that the library receives in the instance.
   * @returns {RateLimitPerMinutesPolicy} return this
   */
  public validateProps(): RateLimitPerSecondsPolicy {
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
      this.policySettings?.periodWindow * ONE_SECOND_IN_MILLISECOND;

    const lastTimeCacheInMilliseconds =
      this.responseRateLimitCache?.last_time_request;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
