import { PolicieRateLimit } from "../../interfaces/policies";

export class ArgumentsPolicyDTO {
  public readonly policy: PolicieRateLimit;

  constructor(policy: PolicieRateLimit) {
    this.policy = policy;
  }
}
