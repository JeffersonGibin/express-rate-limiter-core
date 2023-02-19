import { ICache, IResponseHit } from "../interfaces/cache";
import { ISettings } from "../interfaces/settings";

interface Input {
  ip: string;
  cache: ICache;
  maxRequest: number;
  rateLimitWindow: number;
}

export class RateLimit {
  private settings: ISettings;
  private ip: string;

  constructor(intput: Input) {
    const {maxRequest, rateLimitWindow, cache, ip} = intput
    
    this.ip = ip;
    this.settings = {
      cache,
      maxRequest,
      rateLimitWindow,
    };
  }

  public async processLimitCache(cacheRequest: IResponseHit) {
    const ip = this.ip;
    const timestampNow = Date.now();
    const rateLimitMaxRequests = this.settings.maxRequest;

    const timestampCreated = cacheRequest?.timestamp_created ?? timestampNow;
    const hits = cacheRequest?.hits ?? 0;

    const resultTimeExpiration = timestampCreated + rateLimitMaxRequests * 1000;
    if (timestampCreated && timestampNow > resultTimeExpiration) {
      // remove cache
      this.settings.cache.decrementHit(ip);
    }

    if (rateLimitMaxRequests >= hits) {
      // insert cache
      this.settings.cache.incrementHit(ip);
    }
  }
}
