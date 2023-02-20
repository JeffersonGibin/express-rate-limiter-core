export interface IResponseHit {
  /**
   * Total hits of request
   */
  hits: number;

  /**
   * represented when cache was created
   */
  created_at: number;
}

export interface ICache {
  /**
   * Increment a HIT to a cache using the parameter key. This method needs to implement a logic that store timestamp now.
   * @param {string} key
   * @returns {IResponseHit}
   */
  incrementHit(key: string): IResponseHit;

  /**
   * Delete a HIT to a cache using the parameter key.
   * @param {string} key
   * @returns {boolean}
   */
  deleteHit(key: string): boolean;

  /**
   * Get cache by key
   * @param {string} key
   * @returns {IResponseHit}
   */
  getByKey(key: string): IResponseHit;
}
