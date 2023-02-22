import { IResponseHit } from "../../interfaces/cache";
import {
  ONE_SECOND_IN_MILLISECOND,
  SIXTY_SECONDS,
} from "../../constants/application";
import { IPolicyRequestPerMinutes } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";

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
      throw new Error("The policy doesn't find property [periodWindow]");
    }

    if (!this.policy?.maxRequests) {
      throw new Error("The policy doesn't find property [maxRequests]");
    }

    if (!this.policy?.type) {
      throw new Error("The policy doesn't find property [type]");
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
