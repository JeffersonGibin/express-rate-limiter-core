import { IResponseHit } from "../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND } from "../../constants";
import { IPolicyRequestPerSeconds } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { MissingPropertyException } from "../exceptions/missing-property.exception";
import { getMessageMissingProperty } from "../utils/message-error";

export class RateLimitPerSecondsPolicy extends RateLimitPolicy {
  protected policy: IPolicyRequestPerSeconds;
  protected responseHit: IResponseHit;

  constructor(policy: IPolicyRequestPerSeconds, responseHit: IResponseHit) {
    super(responseHit?.hits);
    this.policy = policy;
    this.responseHit = responseHit;
  }

  public validateProps(): RateLimitPerSecondsPolicy {
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
      this.policy?.periodWindow * ONE_SECOND_IN_MILLISECOND;

    const lastTimeCacheInMilliseconds = this.responseHit?.last_time;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
