export interface IRateLimitCache {
  /**
   * Total hits of request
   */
  hits: number;

  /**
   * represented last time request
   */
  last_time: number;

  /**
   * represented when cache was created
   */
  created_at: number;
}

export interface ICache {
  /**
   * Save a HIT to a cache using the parameter key. This method needs to implement a logic that store timestamp now.
   * @param {string} key
   * @param {value} key
   * @returns {IRateLimitCache}
   */
  saveHit(key: string, value: number): IRateLimitCache;

  /**
   * Delete a HIT to a cache using the parameter key.
   * @param {string} key
   * @returns {boolean}
   */
  deleteHit(key: string): boolean;

  /**
   * Get cache by key
   * @param {string} key
   * @returns {IRateLimitCache}
   */
  getByKey(key: string): IRateLimitCache;
}
