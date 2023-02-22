import {
  type NextFunction as INextFunctionExpress,
  type Request as IExpressRequest,
  type Response as IExpressResponse,
} from "express";

import { RequestInterceptor } from "./application/request-interceptor";
import { HTTP_STATUS_FORBIDDEN } from "./constants/application";
import { type IMiddleware } from "./interfaces/middleware";
import { type ISettings } from "./interfaces/settings";

export const middleware = (settings: ISettings): IMiddleware => {
  return {
    apply: (
      req: IExpressRequest,
      res: IExpressResponse,
      next: INextFunctionExpress
    ) => {
      const interceptor = new RequestInterceptor({
        requestParam: {
          req,
          res,
          next,
        },
        settings,
      });

      const requestBlocked = settings?.blockRequestRule(req);

      if (requestBlocked) {
        res.setHeader("X-Request-Blocked", "Yes");
        res.status(HTTP_STATUS_FORBIDDEN).send({
          message: "Request don't authorized!",
        });
      } else {
        interceptor.execute();
      }
    },
  };
};
