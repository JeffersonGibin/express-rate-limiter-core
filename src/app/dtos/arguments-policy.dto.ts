import { PolicieRateLimit } from "../../core/interfaces/policies";

export class ArgumentsPolicyDTO {
  public readonly policy: PolicieRateLimit;

  constructor(policy: PolicieRateLimit) {
    this.policy = policy;
  }
}
