export interface IResponseHit {
  /**
   * Total hits of request
  */
  hits: number;

  /**
   * Timestamp represented when cache was created
  */
  timestamp_created: number;
}

export interface ICache {
  /** 
   * Increment a HIT to a cache using the parameter key. This method needs to implement a logic that store timestamp now.
   * @param {string} key
   * @returns {IResponseHit}
   */
  incrementHit(key: string): IResponseHit;

  /** 
   * DecrementHit a HIT to a cache using the parameter key.
   * @param {string} key
   * @returns {boolean}
   */
  decrementHit(key: string): boolean;

  /** 
   * Get cache by key
   * @param {string} key
   * @returns {IResponseHit}
   */
  getByKey(key: string): IResponseHit;
}
