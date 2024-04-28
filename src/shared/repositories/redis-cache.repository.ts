import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import { ICache, IRateLimitCache } from "../interfaces/cache";

export class RedisCacheRepository implements ICache {
  private static instance: RedisCacheRepository;

  private client;

  constructor(
    clientRedis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>
  ) {
    this.client = clientRedis;
  }

  static getInstance(
    clientRedis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>
  ): RedisCacheRepository {
    if (!RedisCacheRepository.instance) {
      RedisCacheRepository.instance = new RedisCacheRepository(clientRedis);
    }
    return RedisCacheRepository.instance;
  }

  async saveHit(key: string, newHit: number): Promise<IRateLimitCache> {
    const data: IRateLimitCache = {
      hits: newHit,
      last_time_request: Date.now(),
      created_at: Date.now(),
    };
    await this.client.set(key, JSON.stringify(data));

    return data;
  }

  async updateHit(key: string, newHit: number): Promise<IRateLimitCache> {
    const data: IRateLimitCache = {
      hits: newHit,
      last_time_request: Date.now(),
      created_at: Date.now(),
    };

    await this.client.set(key, JSON.stringify(data));
    return data;
  }

  async deleteHit(key: string): Promise<boolean> {
    const response = await this.client.del(key);
    return response > 0;
  }

  async getByKey(key: string): Promise<IRateLimitCache> {
    const response = await this.client.get(key);
    return JSON.parse(response || "{}") as IRateLimitCache;
  }
}
