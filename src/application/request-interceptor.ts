import { Response as IExpressResponse } from "express";
import { RateLimit } from "./rate-limit";
import { HeaderRequestHandler } from "./header-request-handler";
import { HTTP_STATUS_TOO_MANY_REQUESTS } from "../constants/application";
import { PoliciesFactory } from "./policies/policies.factory";
import { RequestExpressDTO } from "../dtos/request-express.dto";
import { ArgumentsPolicyDTO } from "../dtos/arguments-policy.dto";
import { ICache } from "../interfaces/cache";

export class RequestInterceptor {
  private requestExpressDto: RequestExpressDTO;
  private argumentsPolicyDto: ArgumentsPolicyDTO;
  private cache: ICache;

  constructor(
    requestExpressDto: RequestExpressDTO,
    argumentsPolicyDto: ArgumentsPolicyDTO,
    cache: ICache
  ) {
    this.requestExpressDto = requestExpressDto;
    this.argumentsPolicyDto = argumentsPolicyDto;
    this.cache = cache;
  }

  public execute(): IExpressResponse {
    const cache = this.cache;
    const { req, res, next } = this.requestExpressDto;
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

    const hits = responseCache?.hits;

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
