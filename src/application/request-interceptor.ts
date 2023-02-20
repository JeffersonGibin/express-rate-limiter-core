import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";
import {
  HTTP_STATUS_TOO_MANY_REQUESTS,
  UNIT_TIME_IN_SECONDS,
} from "../constants/application";
import { ICache } from "../interfaces/cache";
import { RateLimit } from "./rate-limit";

interface RequestParams {
  readonly req: IExpressRequest;
  readonly res: IExpressResponse;
  readonly next: INextFunctionExpress;
}

interface InputInterceptor {
  cache: ICache;
  rateLimit: RateLimit;
  requestParam: RequestParams;
  maxRequest: number;
  rateLimitWindow: number;
}

export class RequestInterceptor {
  private input: InputInterceptor;

  constructor(input: InputInterceptor) {
    this.input = input;
  }

  /**
   * Calculate how long it takes to reset the server and release new requests
   * @return {number} time in seconds representation reset
   */
  private calculateTimeToReset(): number {
    return (
      new Date().getTime() + this.input.rateLimitWindow / UNIT_TIME_IN_SECONDS
    );
  }

  /**
   * Calculate how much time is left to release the server for new requests
   * @param {number} diffBetweenNowCreadAt
   * @return {string} time in seconds
   */
  private calculateTimeWait(diffBetweenNowCreadAt: number): string {
    return Math.ceil(
      (diffBetweenNowCreadAt + this.input.rateLimitWindow) /
        UNIT_TIME_IN_SECONDS
    ).toString();
  }

  /**
   * Calculate diff now between created at
   * @param {number} createdAt
   * @return {number} result diff
   */
  private diffNowBetweenCreatedAt(createdAt: number): number {
    const now = Date.now();
    const resultDiff = now - createdAt;

    return resultDiff;
  }

  public execute(): IExpressResponse {
    const { cache, rateLimit } = this.input;
    const { req, res, next } = this.input.requestParam;
    const rateLimitMaxRequests = this.input.maxRequest;
    const clientIp = req.ip;

    // set custom header to identify max request limit
    res.set("X-RateLimit-Limit", rateLimitMaxRequests.toString());

    const responseCache = cache.getByKey(clientIp);
    const hits = responseCache?.hits ?? 0;
    const createdAt = responseCache?.created_at ?? 0;

    // Process Hit increment or decrement
    rateLimit.processHit(responseCache);

    if (hits >= rateLimitMaxRequests) {
      const resultDiffTime = this.diffNowBetweenCreatedAt(createdAt);
      const timestampToReset = this.calculateTimeToReset();
      const timeWaitInSeconds = this.calculateTimeWait(resultDiffTime);

      // Set custom header with time in seconds to specify when API's rate limiting will be reset.
      res.setHeader("X-RateLimit-Reset", Math.ceil(timestampToReset));

      // tells the client how long in seconds to wait before making another request.
      res.set("Retry-After", timeWaitInSeconds);

      return res
        .status(HTTP_STATUS_TOO_MANY_REQUESTS)
        .send({ message: "Too many requests" });
    }

    next();
  }
}
