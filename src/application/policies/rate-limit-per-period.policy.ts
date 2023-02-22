import { IRateLimitCache } from "../../interfaces/cache";
import { IPolicyRequestPerPeriod } from "../../interfaces/policies";
import { ValidationHandler } from "../validations/validation-handler";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";

export class RateLimitPerPeriodPolicy extends RateLimitPolicy {
  protected policySettings: IPolicyRequestPerPeriod;
  protected responseRateLimitCache: IRateLimitCache;

  /**
   * This class represent policies to rate limit per period
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   */
  constructor(
    policySettings: IPolicyRequestPerPeriod,
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
  public validateProps(): RateLimitPerPeriodPolicy {
    // Validations properties
    new ValidationHandler([
      {
        propertyName: "periodWindowStart",
        value: this.policySettings?.periodWindowStart,
        validations: ["exists_property", "is_instance_date"],
      },
      {
        propertyName: "periodWindowEnd",
        value: this.policySettings?.periodWindowEnd,
        validations: ["exists_property", "is_instance_date"],
      },
      {
        propertyName: "type",
        value: this.policySettings?.type,
        validations: ["exists_property", "is_string"],
      },
    ]).execute();

    return this;
  }

  private diffPeriod(): number {
    return (
      this.policySettings?.periodWindowEnd.getTime() -
      this.policySettings?.periodWindowStart.getTime()
    );
  }

  /**
   * Implementation of an abstract model of calculateRateLimitReset.
   * @returns {RateLimitPerMinutesPolicy} return this
   */
  public calculateRateLimitReset(): number {
    const timeWaitInMilliseconds = this.diffPeriod();

    const lastTimeCacheInMilliseconds = this.responseRateLimitCache?.last_time;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
