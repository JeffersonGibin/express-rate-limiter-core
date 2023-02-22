import { IResponseHit } from "../../interfaces/cache";
import { IPolicyRequestPerPeriod } from "../../interfaces/policies";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";

export class RateLimitPerPeriodPolicy extends RateLimitPolicy {
  protected policy: IPolicyRequestPerPeriod;
  protected responseHit: IResponseHit;

  public validateProps(): RateLimitPerPeriodPolicy {
    if (!this.policy?.periodWindowStart) {
      throw new Error("The policy doesn't find property [periodWindowStart]");
    }

    if (!this.policy?.periodWindowEnd) {
      throw new Error("The policy doesn't find property [periodWindowEnd]");
    }

    if (!this.policy?.type) {
      throw new Error("The policy doesn't find property [type]");
    }

    return this;
  }

  private diffPeriod(): number {
    return (
      this.policy?.periodWindowEnd.getTime() -
      this.policy?.periodWindowStart.getTime()
    );
  }

  public calculateRateLimitWindow(): number {
    const timeWaitInMilliseconds = this.diffPeriod();

    const lastTimeCacheInMilliseconds = this.responseHit?.last_time;

    const nextWindowTime = Math.ceil(
      lastTimeCacheInMilliseconds + timeWaitInMilliseconds
    );

    return nextWindowTime;
  }
}
