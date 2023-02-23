import { ResponseExpress } from "../interfaces/express";
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
  blockRequestRule?: BlockRequestRule;
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
  private async rateLimitFlow(): Promise<number> {
    const repositoryCache = this.cache;
    const policyProps = this.argumentsPolicyDto.policy;

    const key = this.requestExpressDto.request?.ip;
    const responseCache = await repositoryCache?.getByKey(key);

    // Create instance of Policy
    const factory = new PoliciesFactory(
      policyProps,
      responseCache,
      repositoryCache
    );

    // factory
    const policyInstanceClass = factory.create();

    // save Hit
    await policyInstanceClass.saveHit(key);

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

    return responseCache?.hits;
  }

  /**
   *
   * @returns {ResponseExpress} It can return instance ResponseExpress
   */
  public async execute(): Promise<ResponseExpress> {
    const { res, next } = this.requestExpressDto;
    const policyProps = this.argumentsPolicyDto.policy;
    const maxRequests = policyProps?.maxRequests;

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
    const hits = await this.rateLimitFlow();

    // Too many requests response
    if (hits > maxRequests) {
      return res.status(HTTP_STATUS_TOO_MANY_REQUESTS).json({
        message: MESSAGE_DEFAULT_TOOMANY_REQUEST,
      });
    }

    next();
  }
}
