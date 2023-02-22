import { IRateLimitCache } from "../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND } from "../../constants";
import { IPolicyRequestPerSeconds } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { ValidationHandler } from "../validations/validation-handler";

export class RateLimitPerSecondsPolicy extends RateLimitPolicy {
  protected policy: IPolicyRequestPerSeconds;
  protected responseHit: IRateLimitCache;

  constructor(policy: IPolicyRequestPerSeconds, responseHit: IRateLimitCache) {
    super(responseHit?.hits);
    this.policy = policy;
    this.responseHit = responseHit;
  }

  public validateProps(): RateLimitPerSecondsPolicy {
    // Validations properties
    new ValidationHandler([
      {
        propertyName: "periodWindow",
        value: this.policy?.periodWindow,
        validations: ["exists_property", "is_number"],
      },
      {
        propertyName: "maxRequests",
        value: this.policy?.maxRequests,
        validations: ["exists_property", "is_number"],
      },
      {
        propertyName: "type",
        value: this.policy?.type,
        validations: ["exists_property", "is_string"],
      },
    ]).execute();

    return this;
  }

  public calculateRateLimitReset(): number {
    const timeWaitInMilliseconds =
      this.policy?.periodWindow * ONE_SECOND_IN_MILLISECOND;

    const lastTimeCacheInMilliseconds = this.responseHit?.last_time;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
