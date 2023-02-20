import { ICache, IResponseHit } from "../interfaces/cache";
import { ISettings } from "../interfaces/settings";

interface RateLimitInput {
  ip: string;
  cache: ICache;
  maxRequest: number;
  rateLimitWindow: number;
}

export class RateLimit {
  private readonly settings: ISettings;
  private readonly ip: string;

  constructor(intput: RateLimitInput) {
    const { maxRequest, rateLimitWindow, cache, ip } = intput;

    if (!ip || typeof ip !== "string") {
      throw new Error("Invalid IP address");
    }

    if (!cache) {
      throw new Error("Invalid cache object");
    }

    if (!maxRequest || maxRequest < 0) {
      throw new Error("Invalid maxRequest value");
    }

    if (!rateLimitWindow || rateLimitWindow < 0) {
      throw new Error("Invalid rateLimitWindow value");
    }

    this.ip = ip;
    this.settings = {
      cache,
      maxRequest,
      rateLimitWindow,
    };
  }

  public async processHit(cacheRequest: IResponseHit) {
    const ip = this.ip;
    const timestampNow = Date.now();
    const rateLimitMaxRequests = this.settings.maxRequest;

    const createdAt = cacheRequest?.created_at ?? timestampNow;
    const hits = cacheRequest?.hits ?? 0;

    const resultTimeExpiration = createdAt + rateLimitMaxRequests * 1000;

    if (createdAt && timestampNow > resultTimeExpiration) {
      // remove cache
      this.settings.cache.decrementHit(ip);
    }

    if (rateLimitMaxRequests >= hits) {
      // insert cache
      this.settings.cache.incrementHit(ip);
    }
  }
}
