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
  requestParam: RequestParams;
  maxRequest: number;
  rateLimitWindow: number;
}

export class RequestInterceptor {
  private input: InputInterceptor;

  constructor(input: InputInterceptor) {
    this.input = input;
  }

  private calculateTimeToReset(): number {
    return (
      new Date().getTime() + this.input.rateLimitWindow / UNIT_TIME_IN_SECONDS
    );
  }

  private calculateTimeWait(resultDiffTime: number): string {
    return Math.ceil(
      (resultDiffTime + this.input.rateLimitWindow) / UNIT_TIME_IN_SECONDS
    ).toString();
  }

  private diffNowBeetwenCreatedAt(createdAt: number) {
    const now = Date.now();
    const resultDiffTime = createdAt - now;

    return resultDiffTime;
  }

  public execute(): IExpressResponse {
    const { req, res, next } = this.input.requestParam;
    const rateLimitWindow = this.input.rateLimitWindow * 1000;
    const rateLimitMaxRequests = this.input.maxRequest;
    const clientIp = req.ip;

    // set custom header to identify max request limit
    res.set("X-RateLimit-Limit", rateLimitMaxRequests.toString());

    const cache = this.input.cache;
    const responseCache = cache.getByKey(clientIp);
    const hits = responseCache?.hits ?? 0;
    const createdAt = responseCache?.created_at ?? 0;

    const rateLimit = new RateLimit({
      ip: clientIp,
      cache,
      maxRequest: rateLimitMaxRequests,
      rateLimitWindow: rateLimitWindow,
    });

    // Process Hit increment or decrement
    rateLimit.processHit(responseCache);

    if (hits >= rateLimitMaxRequests) {
      const resultDiffTime = this.diffNowBeetwenCreatedAt(createdAt);
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
