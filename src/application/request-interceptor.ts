import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";
import { ISettings } from "../interfaces/settings";
import { RateLimit } from "./rate-limit";
import { HeaderRequestHandler } from "./header-request-handler";
import { HTTP_STATUS_TOO_MANY_REQUESTS } from "../constants/application";
import { PoliciesFactory } from "./policies/policies.factory";

export interface RequestParams {
  readonly req: IExpressRequest;
  readonly res: IExpressResponse;
  readonly next: INextFunctionExpress;
}

export interface InputInterceptor {
  requestParam: RequestParams;
  settings: ISettings;
}

export class RequestInterceptor {
  private input: InputInterceptor;

  constructor(input: InputInterceptor) {
    this.input = input;
  }

  public execute(): IExpressResponse {
    const { req, res, next } = this.input.requestParam;
    const { policy, cache } = this.input.settings;
    const policyProps = policy;

    // Find key by IP
    const responseCache = cache?.getByKey(req?.ip);

    const factory = new PoliciesFactory(policyProps.type);
    const policyInstanceClass = factory.create();

    // Set Policy, ResponseCache and Validate Props
    policyInstanceClass
      .setPolicy(policyProps)
      .setResponseHit(responseCache)
      .validateProps();

    // Set RequestProps and policyInstanceClass
    const instanceHeaderRequestHandler = new HeaderRequestHandler()
      .setRequest(req, res, next)
      .setPolicyInstance(policyInstanceClass);

    // process increment or deletehits
    new RateLimit()
      .setPolicy(policyProps)
      .setAdapter(this.input.settings?.cache)
      .setRequest(req, res, next)
      .processIncrementOrDeleteHits();

    // Apply headers
    instanceHeaderRequestHandler
      .applyCommonHeaders()
      .applyRateLimitReset()
      .applyRetryAfter();

    const maxRequests = policyInstanceClass.getPolicy()?.maxRequests;
    const hits = policyInstanceClass.getResponseHit()?.hits;

    // Too many requests response
    if (hits > maxRequests) {
      return res
        .status(HTTP_STATUS_TOO_MANY_REQUESTS)
        .send({ message: "Too many requests" });
    }

    next();
  }
}
