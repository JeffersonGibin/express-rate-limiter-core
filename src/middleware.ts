import { Application } from "./application/application";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "./constants";
import { ArgumentsPolicyDTO } from "./dtos/arguments-policy.dto";
import { RequestExpressDTO } from "./dtos/request-express.dto";

import { IMiddleware } from "./interfaces/middleware";
import { ISettings } from "./interfaces/settings";
import {
  RequestExpress,
  ResponseExpress,
  NextFunctionExpress,
} from "./interfaces/express";

export const middleware = (settings: ISettings): IMiddleware => {
  return {
    apply: (
      req: RequestExpress,
      res: ResponseExpress,
      next: NextFunctionExpress
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
          from: "EXPRESS_RATE_LIMITER_CORE",
          type: error.name,
          message: error.message,
        });
      }
    },
  };
};
