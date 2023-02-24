import { IRateLimitCache } from "../interfaces/cache";
import { RequestExpressDTO } from "../dtos/request-express.dto";
import { RateLimitPolicy } from "../core/policies/abstract/rate-limit.policy";
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

  /**
   * Class to headers manipulation
   * @param {RequestExpressDTO} requestExpressDto data transfer Object Request of Library Instance
   * @param {RateLimitPolicy} policyInstance instance of class policy
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   */
  constructor(
    requestExpressDto: RequestExpressDTO,
    policyInstance: RateLimitPolicy,
    responseRateLimitCache: IRateLimitCache
  ) {
    this.request = requestExpressDto.req;
    this.response = requestExpressDto.res;
    this.next = requestExpressDto.next;

    this.policyInstance = policyInstance;
    this.responseHits = responseRateLimitCache;
  }

  /**
   * Apply custom common headers as: X-RateLimit-Limit and X-RateLimit-Remaining
   * @param {number} maxRequests max requests allowed
   * @returns {HeaderRequestHandler} this
   */
  public applyCommonHeaders(maxRequests: number): HeaderRequestHandler {
    // set custom header to identify max request limit
    this.response.setHeader("X-RateLimit-Limit", maxRequests.toString());

    // set custom header to define remaning request
    const requestRemaning = this.policyInstance?.amountRequestRemaining();

    if (requestRemaning > 0) {
      this.response?.setHeader("X-RateLimit-Remaining", requestRemaning);
    }

    return this;
  }

  /**
   * Apply custom header X-RateLimit-Reset
   * @param {number} maxRequests max requests allowed
   * @returns {HeaderRequestHandler} this
   */
  public applyRateLimitReset(maxRequests: number): HeaderRequestHandler {
    const hits = this.responseHits?.hits;

    if (hits > maxRequests) {
      const dateToResetCache = new Date(
        this.policyInstance?.whenTimeRateLimitReset()
      ).toISOString();

      this.response.setHeader("X-RateLimit-Reset", dateToResetCache);
    }

    return this;
  }

  /**
   * Apply Retry-After-Reset header
   * @param {number} maxRequests max requests allowed
   * @returns {HeaderRequestHandler} this
   */
  public applyRetryAfter(maxRequests: number): HeaderRequestHandler {
    const hits = this.responseHits?.hits;

    if (hits > maxRequests) {
      // tells the client how long in seconds to wait before making another request.
      this.response.setHeader(
        "Retry-After",
        this.policyInstance?.timeWaitToRetryAfter()
      );
    }

    return this;
  }
}
