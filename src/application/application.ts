import { Response as IExpressResponse } from "express";
import { RateLimit } from "./rate-limit";
import { HeaderRequestHandler } from "./header-request-handler";
import {
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from "../constants";
import { PoliciesFactory } from "./policies/policies.factory";
import { RequestExpressDTO } from "../dtos/request-express.dto";
import { ArgumentsPolicyDTO } from "../dtos/arguments-policy.dto";
import { ICache } from "../interfaces/cache";
import { BlockRequestRule } from "../interfaces/settings";

interface InputApplication {
  requestExpressDto: RequestExpressDTO;
  argumentsPolicyDto: ArgumentsPolicyDTO;
  blockRequestRule: BlockRequestRule;
  cache: ICache;
}

export class Application {
  private requestExpressDto: RequestExpressDTO;
  private argumentsPolicyDto: ArgumentsPolicyDTO;
  private cache: ICache;
  private blockRequestRule: BlockRequestRule;

  constructor(input: InputApplication) {
    this.requestExpressDto = input.requestExpressDto;
    this.argumentsPolicyDto = input.argumentsPolicyDto;
    this.cache = input.cache;
    this.blockRequestRule = input.blockRequestRule;
  }

  private rateLimitFlow(): number {
    const cache = this.cache;
    const { req } = this.requestExpressDto;
    const policyProps = this.argumentsPolicyDto.policy;

    // Find cache by key
    const responseCache = cache?.getByKey(req?.ip);

    // Create instance of Policy
    const factory = new PoliciesFactory(policyProps, responseCache);
    const policyInstanceClass = factory.create();

    // ResponseCache and Validate Props
    policyInstanceClass.validateProps();

    // Set RequestProps and policyInstanceClass
    const instanceHeaderRequestHandler = new HeaderRequestHandler(
      this.requestExpressDto,
      policyInstanceClass,
      responseCache
    );

    // process increment or deletehits
    const key = req?.ip;
    new RateLimit(key, policyProps).setAdapter(cache).save();

    // Apply headers
    const maxRequests = policyProps.maxRequests;
    instanceHeaderRequestHandler
      .applyCommonHeaders(maxRequests)
      .applyRateLimitReset(maxRequests)
      .applyRetryAfter(maxRequests);

    return responseCache?.hits;
  }

  public execute(): IExpressResponse {
    const { res, next } = this.requestExpressDto;
    const policyProps = this.argumentsPolicyDto.policy;
    const maxRequests = policyProps?.maxRequests;

    // Block Request
    const requestBlocked = this?.blockRequestRule
      ? this?.blockRequestRule(this.requestExpressDto.request)
      : false;

    if (requestBlocked) {
      return this.requestExpressDto.response
        .status(HTTP_STATUS_FORBIDDEN)
        .send({
          message: "Request don't authorized!",
        });
    }

    // Process All flow to Rate Limit
    const hits = this.rateLimitFlow();

    // Too many requests response
    if (hits > maxRequests) {
      return res.status(HTTP_STATUS_TOO_MANY_REQUESTS).send({
        message:
          "Too many requests. You've exceeded the rate limit for requests",
      });
    }

    next();
  }
}
