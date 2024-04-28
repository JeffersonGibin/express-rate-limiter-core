import { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "redis";

/* eslint-disable no-unused-vars */
export interface IRateLimitCache {
  /**
   * Total hits of request
   */
  hits: number;

  /**
   * represented last time request
   */
  last_time_request: number;

  /**
   * represented when cache was created
   */
  created_at: number;
}

export type RedisCache = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

export type CacheStrategy = "REDIS" | "IN_MEMORY" | "CUSTOM";

export interface ICache {
  /**
   * Save a HIT to a cache using the parameter key.
   *  This method needs to implement a logic that store hits, last_time_request and created_at
   * @param {string} key
   * @param {number} newHit
   * @returns {IRateLimitCache}
   */
  saveHit(key: string, newHit: number): Promise<IRateLimitCache>;

  /**
   * Update a HIT to a cache using the parameter key.
   * This method needs to implement a logic that store hits, last_time_request and created_at
   * @param {string} key
   * @param {number} newHit
   * @returns {IRateLimitCache}
   */
  updateHit(key: string, newHit: number): Promise<IRateLimitCache>;

  /**
   * Delete a HIT to a cache using the parameter key.
   * @param {string} key
   * @returns {boolean}
   */
  deleteHit(key: string): Promise<boolean>;

  /**
   * Get cache by key
   * @param {string} key
   * @returns {IRateLimitCache}
   */
  getByKey(key: string): Promise<IRateLimitCache>;
}
