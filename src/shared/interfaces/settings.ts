/* eslint-disable no-unused-vars */
import { RequestExpress } from "../../core/interfaces/express";
import { PolicieRateLimit } from "../../core/interfaces/policies";
import { CacheStrategy, ICache, RedisCache } from "./cache";

export type BlockRequestRule = (req: RequestExpress) => boolean;

interface ISettingsBase {
  strategyCache?: CacheStrategy;

  /**
   * The object with settings to policy rate-limit.
   */
  policy: PolicieRateLimit;

  /**
   * This function can to be implemented to forbidden a request.
   * @param {IExpressRequest} req
   * @returns {boolean}
   */
  blockRequestRule?: BlockRequestRule;
}

interface ISettingsMemoryCache extends ISettingsBase {
  /**
   * Specifies the type of cache to use.
   * @default IN_MEMORY
   */
  strategyCache?: "IN_MEMORY";
}

interface ISettingsRedisCache extends ISettingsBase {
  redis: RedisCache;

  /**
   * Specifies the type of cache to use.
   * @default IN_MEMORY
   */
  strategyCache?: "REDIS";
}

interface ISettingsCustomCache extends ISettingsBase {
  /**
   * Specifies the type of cache to use.
   * @default IN_MEMORY
   */
  strategyCache?: "CUSTOM";

  /**
   * This atributte  is opcional and needs to receive an classe to type ICache.
   * You can implement a custom Cache if you want as long as the interface is respected
   * @default MemoryCache
   */
  cache: ICache;
}

export type ISettings =
  | ISettingsMemoryCache
  | ISettingsRedisCache
  | ISettingsCustomCache;
