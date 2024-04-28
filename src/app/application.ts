import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_TOO_MANY_REQUESTS,
  MESSAGE_DEFAULT_TOOMANY_REQUEST,
  MESSAGE_DEFAULT_UNAUTHORIZED_REQUEST,
  MESSAGE_INVALID_IP,
} from "../core/constants";
import { PoliciesFactory } from "../core/policies/policies.factory";

import { HeaderRequestHandler } from "./header-request-handler";
import { ArgumentsPolicyDTO } from "./dtos/arguments-policy.dto";
import { RequestExpressDTO } from "./dtos/request-express.dto";

import { ResponseExpress } from "../core/interfaces/express";
import { BlockRequestRule } from "../shared/interfaces/settings";
import { ICache } from "../shared/interfaces/cache";
import { Ip } from "./ip";

interface IParametersApplication {
  requestExpressDto: RequestExpressDTO;
  argumentsPolicyDto: ArgumentsPolicyDTO;
  blockRequestRule?: BlockRequestRule;
  cache: ICache;
}

export class Application {
  private requestExpressDto: RequestExpressDTO;
  private argumentsPolicyDto: ArgumentsPolicyDTO;
  private cache: ICache;
  private blockRequestRule: BlockRequestRule;
  private ip: string;

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
  private async rateLimitFlow(ip: string): Promise<number> {
    const repositoryCache = this.cache;
    const policyProps = this.argumentsPolicyDto.policy;

    const key = ip;
    const responseCache = await repositoryCache?.getByKey(key);

    // Create instance of Policy
    const factory = new PoliciesFactory(
      policyProps,
      responseCache,
      repositoryCache
    );

    // factory
    const policyInstanceClass = factory.create();

    // ResponseCache and Validate Props
    policyInstanceClass.validateProps();

    // Set RequestProps and policyInstanceClass
    const instanceHeaderRequestHandler = new HeaderRequestHandler(
      this.requestExpressDto,
      policyInstanceClass,
      responseCache
    );

    // Apply headers
    const maxRequests = policyProps.maxRequests;
    instanceHeaderRequestHandler
      .applyCommonHeaders(maxRequests)
      .applyRateLimitReset(maxRequests)
      .applyRetryAfter(maxRequests);

    // [Note]: The 'saveHits' method needs to be after the headers are applied.
    await policyInstanceClass.saveHit(key);

    return responseCache?.hits;
  }

  /**
   *
   * @returns {ResponseExpress} It can return instance ResponseExpress
   */
  public async execute(): Promise<ResponseExpress> {
    const { req, res, next } = this.requestExpressDto;
    const policyProps = this.argumentsPolicyDto.policy;
    const maxRequests = policyProps?.maxRequests;

    const ipInstance = new Ip(req);

    if (!ipInstance.isIP(req.ip)) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({
        message: MESSAGE_INVALID_IP,
      });
    }

    // Block Request
    const requestBlocked =
      this?.blockRequestRule && typeof this?.blockRequestRule === "function"
        ? this?.blockRequestRule(this.requestExpressDto.request)
        : false;

    if (requestBlocked) {
      return res.status(HTTP_STATUS_FORBIDDEN).json({
        message: MESSAGE_DEFAULT_UNAUTHORIZED_REQUEST,
      });
    }

    // Process All flow to Rate Limit
    const ip = ipInstance.getIp();
    const hits = await this.rateLimitFlow(ip);

    // Too many requests response
    if (hits > maxRequests) {
      return res.status(HTTP_STATUS_TOO_MANY_REQUESTS).json({
        message: MESSAGE_DEFAULT_TOOMANY_REQUEST,
      });
    }

    next();
  }
}
