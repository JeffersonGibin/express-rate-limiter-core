import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";
import { ICache } from "../interfaces/cache";
import { RateLimit } from "./rate-limit";

interface RequestParams {
  readonly req: IExpressRequest;
  readonly res: IExpressResponse;
  readonly next: INextFunctionExpress;
}

interface Input {
  cache: ICache;
  requestParam: RequestParams;
  maxRequest: number;
  rateLimitWindow: number;
}

export class Application {
  private req: IExpressRequest;
  private res: IExpressResponse;
  private next: INextFunctionExpress;
  private rateLimitWindow: number;
  private maxRequest: number;
  private cache: ICache;

  constructor(input: Input) {
    this.req = input.requestParam.req;
    this.res = input.requestParam.res;
    this.next = input.requestParam.next;

    this.cache = input.cache;

    this.rateLimitWindow = input.rateLimitWindow;
    this.maxRequest = input.maxRequest;
  }

  public execute(): any {
    const rateLimitWindow = this.rateLimitWindow * 1000;
    const rateLimitMaxRequests = this.maxRequest;
    const clientIp = this.req.ip;
    const now = Date.now();
    
    // set custom header to identify max request limit
    this.res.set("X-RateLimit-Limit", rateLimitMaxRequests.toString());
    
    const cache = this.cache;
    const responseCahe = cache.getByKey(clientIp);
    const hits = responseCahe?.hits ?? 0;
    const timestampCreated = responseCahe?.timestamp_created ?? 0;
    
    new RateLimit({
      ip: clientIp,
      cache,
      maxRequest: rateLimitMaxRequests,
      rateLimitWindow: rateLimitWindow,
    }).processLimitCache(responseCahe);

    if (hits >= rateLimitMaxRequests) {
      const resultDiffTime = timestampCreated - now;
      const timestampToReset = new Date().getTime() + rateLimitWindow / 1000;
      const HTTP_STATUS_TOO_MANY_REQUESTS = 429;

      const timeWaitInSeconds = Math.ceil(
        (resultDiffTime + rateLimitWindow) / 1000
      ).toString();

      // Set custom header with time in seconds to specify when API's rate limiting will be reset.
      this.res.setHeader("X-RateLimit-Reset", Math.ceil(timestampToReset));

      // tells the client how long in seconds to wait before making another request.
      this.res.set("Retry-After", timeWaitInSeconds);

      return this.res
        .status(HTTP_STATUS_TOO_MANY_REQUESTS)
        .send({ message: "Too many requests" });
    }

    this.next();
  }
}
