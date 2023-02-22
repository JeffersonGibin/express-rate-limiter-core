import { IResponseHit } from "../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND, SIXTY_SECONDS } from "../../constants";
import { IPolicyRequestPerMinutes } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { ValidationHandler } from "../validations/validation-handler";

export class RateLimitPerMinutesPolicy extends RateLimitPolicy {
  protected policy: IPolicyRequestPerMinutes;
  protected responseHit: IResponseHit;

  constructor(policy: IPolicyRequestPerMinutes, responseHit: IResponseHit) {
    super(responseHit?.hits);
    this.policy = policy;
    this.responseHit = responseHit;
  }

  public validateProps(): RateLimitPerMinutesPolicy {
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
      this.policy?.periodWindow * SIXTY_SECONDS * ONE_SECOND_IN_MILLISECOND;

    const lastTimeCacheInMilliseconds = this.responseHit?.last_time;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
