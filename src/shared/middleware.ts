import { Application } from "../app/application";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "../core/constants";

import { IMiddleware } from "../core/interfaces/middleware";

import {
  RequestExpress,
  ResponseExpress,
  NextFunctionExpress,
} from "../core/interfaces/express";
import { MemoryCacheRepository } from "./repositories/memory-cache.repository";
import { ArgumentsPolicyDTO } from "../app/dtos/arguments-policy.dto";
import { RequestExpressDTO } from "../app/dtos/request-express.dto";
import { ISettings } from "./interfaces/settings";

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

        // if the cache was defined in a library instance use that was defined otherwise use repository in memory
        const cache = settings?.cache
          ? settings?.cache
          : MemoryCacheRepository.getInstance();

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
          from: "Express Rate Limit Core",
          type: error.name,
          message: error.message,
        });
      }
    },
  };
};
