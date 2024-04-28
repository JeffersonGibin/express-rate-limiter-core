import { Application } from "../app/application";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "../core/constants";

import { IMiddleware } from "../core/interfaces/middleware";

import {
  RequestExpress,
  ResponseExpress,
  NextFunctionExpress,
} from "../core/interfaces/express";
import { ArgumentsPolicyDTO } from "../app/dtos/arguments-policy.dto";
import { RequestExpressDTO } from "../app/dtos/request-express.dto";
import { ISettings } from "./interfaces/settings";
import { getStrategyCache } from "./get-strategy-cache";

export const middleware = (settings: ISettings): IMiddleware => {
  return {
    apply: (
      req: RequestExpress,
      res: ResponseExpress,
      next: NextFunctionExpress
    ) => {
      try {
        const requestExpressDto = new RequestExpressDTO(req, res, next);
        const argumentsPolicyDto = new ArgumentsPolicyDTO(settings.policy);
        const blockRequestRule = settings?.blockRequestRule;
        const cache = getStrategyCache(settings);

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
          message: error.message,
        });
      }
    },
  };
};
