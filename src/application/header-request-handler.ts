import {
  Request as IExpressRequest,
  Response as IExpressResponse,
  NextFunction as INextFunction,
} from "express";
import { RateLimitPolicy } from "./policies/abstract/rate-limit.policy";

export class HeaderRequestHandler {
  private request: IExpressRequest;
  private response: IExpressResponse;
  private next: INextFunction;
  private policyInstance: RateLimitPolicy;

  public setRequest(
    req: IExpressRequest,
    res: IExpressResponse,
    next: INextFunction
  ): HeaderRequestHandler {
    this.request = req;
    this.response = res;
    this.next = next;

    return this;
  }

  public setPolicyInstance(
    policyInstance: RateLimitPolicy
  ): HeaderRequestHandler {
    this.policyInstance = policyInstance;

    return this;
  }

  public applyCommonHeaders(): HeaderRequestHandler {
    const maxRequests = this.policyInstance.getPolicy().maxRequests;

    // set custom header to identify max request limit
    this.response.setHeader("X-RateLimit-Limit", maxRequests.toString());

    // set custom header to define remaning request
    const requestRemaning = this.policyInstance?.calculateRemaning();

    if (requestRemaning >= 0) {
      this.response?.setHeader("X-RateLimit-Remaining", requestRemaning);
    }

    return this;
  }

  public applyRateLimitReset(): HeaderRequestHandler {
    const maxRequests = this.policyInstance.getPolicy()?.maxRequests;
    const hits = this.policyInstance.getResponseHit()?.hits;

    if (hits > maxRequests) {
      const nextDateReset = new Date(
        this.policyInstance?.calculateRateLimitWindow()
      ).toISOString();

      this.response.setHeader("X-RateLimit-Reset", nextDateReset);
    }

    return this;
  }

  public applyRetryAfter(): HeaderRequestHandler {
    const maxRequests = this.policyInstance.getPolicy()?.maxRequests;
    const hits = this.policyInstance.getResponseHit()?.hits;

    if (hits > maxRequests) {
      // tells the client how long in seconds to wait before making another request.
      this.response.setHeader(
        "Retry-After",
        this.policyInstance?.calculateRetryAfter()
      );
    }

    return this;
  }
}
