import { ResponseExpress } from "../interfaces/express";
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
import {
  MESSAGE_DEFAULT_TOOMANY_REQUEST,
  MESSAGE_DEFAULT_UNAUTHORIZED_REQUEST,
} from "../constants/message";

interface IParametersApplication {
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

  /**
   * The start of the application
   * @param {IParametersApplication} paramters
   */
  constructor(paramters: IParametersApplication) {
    this.requestExpressDto = paramters.requestExpressDto;
    this.argumentsPolicyDto = paramters.argumentsPolicyDto;
    this.cache = paramters.cache;
    this.blockRequestRule = paramters.blockRequestRule;
  }

  /**
   * Full 'rate limit' execution flow
   * @returns {number} total hits application
   */
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

  /**
   *
   * @returns {ResponseExpress} It can return instance ResponseExpress
   */
  public execute(): ResponseExpress {
    const { res, next } = this.requestExpressDto;
    const policyProps = this.argumentsPolicyDto.policy;
    const maxRequests = policyProps?.maxRequests;

    // Block Request
    const requestBlocked =
      this?.blockRequestRule && typeof this?.blockRequestRule === "function"
        ? this?.blockRequestRule(this.requestExpressDto.request)
        : false;

    if (requestBlocked) {
      return this.requestExpressDto.response
        .status(HTTP_STATUS_FORBIDDEN)
        .send({
          message: MESSAGE_DEFAULT_UNAUTHORIZED_REQUEST,
        });
    }

    // Process All flow to Rate Limit
    const hits = this.rateLimitFlow();

    // Too many requests response
    if (hits > maxRequests) {
      return res.status(HTTP_STATUS_TOO_MANY_REQUESTS).send({
        message: MESSAGE_DEFAULT_TOOMANY_REQUEST,
      });
    }

    next();
  }
}
