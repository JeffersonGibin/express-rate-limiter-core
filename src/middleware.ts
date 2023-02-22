import {
  type NextFunction as INextFunctionExpress,
  type Request as IExpressRequest,
  type Response as IExpressResponse,
} from "express";

import { RequestInterceptor } from "./application/request-interceptor";
import { HTTP_STATUS_FORBIDDEN } from "./constants/application";
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
      const requestExpressDto = new RequestExpressDTO(req, res, next);
      const argumentsPolicyDto = new ArgumentsPolicyDTO(settings.policy);
      const cache = settings.cache;

      const interceptor = new RequestInterceptor(
        requestExpressDto,
        argumentsPolicyDto,
        cache
      );

      const requestBlocked = settings?.blockRequestRule(req);

      if (requestBlocked) {
        res.status(HTTP_STATUS_FORBIDDEN).send({
          message: "Request don't authorized!",
        });
      } else {
        interceptor.execute();
      }
    },
  };
};
