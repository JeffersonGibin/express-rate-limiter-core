import { IRateLimitCache } from "../../interfaces/cache";
import { IPolicyRequestPerPeriod } from "../../interfaces/policies";
import { ValidationHandler } from "../validations/validation-handler";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";

export class RateLimitPerPeriodPolicy extends RateLimitPolicy {
  protected policy: IPolicyRequestPerPeriod;
  protected responseHit: IRateLimitCache;

  constructor(policy: IPolicyRequestPerPeriod, responseHit: IRateLimitCache) {
    super(responseHit?.hits);
    this.policy = policy;
    this.responseHit = responseHit;
  }

  public validateProps(): RateLimitPerPeriodPolicy {
    // Validations properties
    new ValidationHandler([
      {
        propertyName: "periodWindowStart",
        value: this.policy?.periodWindowStart,
        validations: ["exists_property", "is_instance_date"],
      },
      {
        propertyName: "periodWindowEnd",
        value: this.policy?.periodWindowEnd,
        validations: ["exists_property", "is_instance_date"],
      },
      {
        propertyName: "type",
        value: this.policy?.type,
        validations: ["exists_property", "is_string"],
      },
    ]).execute();

    return this;
  }

  private diffPeriod(): number {
    return (
      this.policy?.periodWindowEnd.getTime() -
      this.policy?.periodWindowStart.getTime()
    );
  }

  public calculateRateLimitReset(): number {
    const timeWaitInMilliseconds = this.diffPeriod();

    const lastTimeCacheInMilliseconds = this.responseHit?.last_time;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
