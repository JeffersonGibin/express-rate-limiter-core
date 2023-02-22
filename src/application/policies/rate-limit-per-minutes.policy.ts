import { IResponseHit } from "../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND, SIXTY_SECONDS } from "../../constants";
import { IPolicyRequestPerMinutes } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { MissingPropertyException } from "../exceptions/missing-property.exception";
import { getMessageMissingProperty } from "../utils/message-error";

export class RateLimitPerMinutesPolicy extends RateLimitPolicy {
  protected policy: IPolicyRequestPerMinutes;
  protected responseHit: IResponseHit;

  constructor(policy: IPolicyRequestPerMinutes, responseHit: IResponseHit) {
    super(responseHit?.hits);
    this.policy = policy;
    this.responseHit = responseHit;
  }

  public validateProps(): RateLimitPerMinutesPolicy {
    if (!this.policy?.periodWindow) {
      throw new MissingPropertyException(
        getMessageMissingProperty("periodWindow")
      );
    }

    if (!this.policy?.maxRequests) {
      throw new MissingPropertyException(
        getMessageMissingProperty("maxRequests")
      );
    }

    if (!this.policy?.type) {
      throw new MissingPropertyException(getMessageMissingProperty("type"));
    }

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
