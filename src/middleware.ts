import {
  type NextFunction as INextFunctionExpress,
  type Request as IExpressRequest,
  type Response as IExpressResponse,
} from "express";

import { Application } from "./application/application";
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

      const application = new Application({
        cache,
        requestParam: {
          req,
          res,
          next,
        },
        maxRequest,
        rateLimitWindow,
      });

      application.execute();
    },
  };
};
