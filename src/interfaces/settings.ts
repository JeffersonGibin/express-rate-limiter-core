import { Request as IExpressRequest } from "express";

import { ICache } from "./cache";
import { PolicieRateLimit } from "./policies";

export interface ISettings {
  /**
   * This atributte  is opcional and needs to receive an adapter.
   * You can implement a custom adapter if you want as long as the interface is respected
   */
  cache: ICache;

  /**
   * This function can to be implemented to forbidden a request.
   * @param {IExpressRequest} req
   * @returns {boolean}
   */
  blockRequestRule?(req: IExpressRequest): boolean;

  /**
   * The object with settings to policy rate limit.
   */
  policy: PolicieRateLimit;
}
