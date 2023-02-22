import { Policy } from "../../interfaces/policies";
import { RateLimitPerMinutesPolicy } from "./rate-limit-per-minutes.policy";
import { RateLimitPerPeriodPolicy } from "./rate-limit-per-period.policy";
import { RateLimitPerSecondsPolicy } from "./rate-limit-per-seconds.policy";

export class PoliciesFactory {
  private type: Policy;

  constructor(type: Policy) {
    this.type = type;
  }

  create() {
    if (this.type === "REQUEST_PER_SECONDS") {
      return new RateLimitPerSecondsPolicy();
    }

    if (this.type === "REQUEST_PER_MINUTES") {
      return new RateLimitPerMinutesPolicy();
    }

    if (this.type === "REQUEST_PER_PERIOD") {
      return new RateLimitPerPeriodPolicy();
    }
  }
}
