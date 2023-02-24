/* eslint-disable no-unused-vars */
import { RequestExpress } from "../../core/interfaces/express";
import { PolicieRateLimit } from "../../core/interfaces/policies";
import { ICache } from "./cache";

export type BlockRequestRule = (req: RequestExpress) => boolean;

export interface ISettings {
  /**
   * This atributte  is opcional and needs to receive an classe to type ICache.
   * You can implement a custom Cache if you want as long as the interface is respected
   * @default MemoryCache
   */
  cache?: ICache;

  /**
   * This function can to be implemented to forbidden a request.
   * @param {IExpressRequest} req
   * @returns {boolean}
   */
  blockRequestRule?: BlockRequestRule;

  /**
   * The object with settings to policy rate-limit.
   */
  policy: PolicieRateLimit;
}
