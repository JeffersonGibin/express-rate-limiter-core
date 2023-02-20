import {
  type NextFunction as INextFunctionExpress,
  type Request as IExpressRequest,
  type Response as IExpressResponse,
} from "express";

import { RequestInterceptor } from "./application/request-interceptor";
import { type IMiddleware } from "./interfaces/middleware";
import { type ISettings } from "./interfaces/settings";

export const middleware = (settings: ISettings): IMiddleware => {
  return {
    apply: (
      req: IExpressRequest,
      res: IExpressResponse,
      next: INextFunctionExpress
    ) => {
      const { maxRequest, rateLimitWindow, cache } = settings;

      const interceptor = new RequestInterceptor({
        cache,
        requestParam: {
          req,
          res,
          next,
        },
        maxRequest,
        rateLimitWindow,
      });

      interceptor.execute();
    },
  };
};
