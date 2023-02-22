import { IResponseHit } from "../../interfaces/cache";
import { IPolicyRequestPerPeriod } from "../../interfaces/policies";
import { MissingPropertyException } from "../exceptions/missing-property.exception";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";

export class RateLimitPerPeriodPolicy extends RateLimitPolicy {
  protected policy: IPolicyRequestPerPeriod;
  protected responseHit: IResponseHit;

  constructor(policy: IPolicyRequestPerPeriod, responseHit: IResponseHit) {
    super(responseHit?.hits);
    this.policy = policy;
    this.responseHit = responseHit;
  }

  public validateProps(): RateLimitPerPeriodPolicy {
    if (!this.policy?.periodWindowStart) {
      throw new MissingPropertyException(
        "The policy doesn't find property [periodWindowStart]"
      );
    }

    if (!this.policy?.periodWindowEnd) {
      throw new MissingPropertyException(
        "The policy doesn't find property [periodWindowEnd]"
      );
    }

    if (!this.policy?.type) {
      throw new MissingPropertyException(
        "The policy doesn't find property [type]"
      );
    }

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
