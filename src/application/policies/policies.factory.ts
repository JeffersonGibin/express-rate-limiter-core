import { IResponseHit } from "../../interfaces/cache";
import { PolicieRateLimit } from "../../interfaces/policies";
import { RateLimitPerMinutesPolicy } from "./rate-limit-per-minutes.policy";
import { RateLimitPerPeriodPolicy } from "./rate-limit-per-period.policy";
import { RateLimitPerSecondsPolicy } from "./rate-limit-per-seconds.policy";

export class PoliciesFactory {
  private policy: PolicieRateLimit;
  private responseHit: IResponseHit;

  constructor(policy: PolicieRateLimit, responseHit: IResponseHit) {
    this.policy = policy;
    this.responseHit = responseHit;
  }

  create() {
    if (this.policy.type === "REQUEST_PER_SECONDS") {
      return new RateLimitPerSecondsPolicy(this.policy, this.responseHit);
    }

    if (this.policy.type === "REQUEST_PER_MINUTES") {
      return new RateLimitPerMinutesPolicy(this.policy, this.responseHit);
    }

    if (this.policy.type === "REQUEST_PER_PERIOD") {
      return new RateLimitPerPeriodPolicy(this.policy, this.responseHit);
    }
  }
}
