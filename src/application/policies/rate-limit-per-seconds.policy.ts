import { IResponseHit } from "../../interfaces/cache";
import { ONE_SECOND_IN_MILLISECOND } from "../../constants";
import { IPolicyRequestPerSeconds } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";
import { MissingPropertyException } from "../exceptions/missing-property.exception";

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
        "The policy doesn't find property [periodWindow]"
      );
    }

    if (!this.policy?.maxRequests) {
      throw new MissingPropertyException(
        "The policy doesn't find property [maxRequests]"
      );
    }

    if (!this.policy?.type) {
      throw new MissingPropertyException(
        "The policy doesn't find property [type]"
      );
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
