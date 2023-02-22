import {
  type NextFunction as INextFunctionExpress,
  type Request as IExpressRequest,
  type Response as IExpressResponse,
} from "express";

import { Application } from "./application/application";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "./constants";
import { ArgumentsPolicyDTO } from "./dtos/arguments-policy.dto";
import { RequestExpressDTO } from "./dtos/request-express.dto";

import { type IMiddleware } from "./interfaces/middleware";
import { type ISettings } from "./interfaces/settings";

export const middleware = (settings: ISettings): IMiddleware => {
  return {
    apply: (
      req: IExpressRequest,
      res: IExpressResponse,
      next: INextFunctionExpress
    ) => {
      try {
        const cache = settings.cache;
        const requestExpressDto = new RequestExpressDTO(req, res, next);
        const argumentsPolicyDto = new ArgumentsPolicyDTO(settings.policy);
        const blockRequestRule = settings?.blockRequestRule;

        const app = new Application({
          blockRequestRule,
          requestExpressDto,
          argumentsPolicyDto,
          cache,
        });

        // Execute application
        app.execute();
      } catch (error) {
        return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
          author: "EXPRESS_RATE_LIMITER_CORE",
          type: error.name,
          message: error.message,
        });
      }
    },
  };
};
