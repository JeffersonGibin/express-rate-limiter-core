import { IRateLimitCache } from "../interfaces/cache";
import { RequestExpressDTO } from "../dtos/request-express.dto";
import { RateLimitPolicy } from "./policies/abstract/rate-limit.policy";
import {
  RequestExpress,
  ResponseExpress,
  NextFunctionExpress,
} from "../interfaces/express";

export class HeaderRequestHandler {
  private request: RequestExpress;
  private response: ResponseExpress;
  private next: NextFunctionExpress;
  private policyInstance: RateLimitPolicy;
  private responseHits: IRateLimitCache;

  constructor(
    requestExpressDto: RequestExpressDTO,
    policyInstance: RateLimitPolicy,
    responseHits: IRateLimitCache
  ) {
    this.request = requestExpressDto.req;
    this.response = requestExpressDto.res;
    this.next = requestExpressDto.next;

    this.policyInstance = policyInstance;
    this.responseHits = responseHits;
  }

  public applyCommonHeaders(maxRequests: number): HeaderRequestHandler {
    // set custom header to identify max request limit
    this.response.setHeader("X-RateLimit-Limit", maxRequests.toString());

    // set custom header to define remaning request
    const requestRemaning = this.policyInstance?.calculateRemaning();

    if (requestRemaning >= 0) {
      this.response?.setHeader("X-RateLimit-Remaining", requestRemaning);
    }

    return this;
  }

  public applyRateLimitReset(maxRequests: number): HeaderRequestHandler {
    const hits = this.responseHits?.hits;

    if (hits > maxRequests) {
      const nextDateReset = new Date(
        this.policyInstance?.calculateRateLimitReset()
      ).toISOString();

      this.response.setHeader("X-RateLimit-Reset", nextDateReset);
    }

    return this;
  }

  public applyRetryAfter(maxRequests: number): HeaderRequestHandler {
    const hits = this.responseHits?.hits;

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
