import { ICache } from "./interfaces/cache";
import { ISettings } from "./interfaces/settings";
import { MemoryCacheRepository } from "./repositories/memory-cache.repository";
import { RedisCacheRepository } from "./repositories/redis-cache.repository";

export const getStrategyCache = (settings: ISettings): ICache => {
  // Default to IN_MEMORY if no strategy is specified or if IN_MEMORY is explicitly specified
  if (!settings.strategyCache || settings.strategyCache === "IN_MEMORY") {
    return MemoryCacheRepository.getInstance();
  }

  // Ensure that a custom cache is provided if the strategy is CUSTOM
  if (settings.strategyCache === "CUSTOM") {
    if (!settings.cache) {
      throw new Error("When the property 'strategyCache' is 'CUSTOM', the property 'cache' is required.");
    }
    return settings.cache;
  }

  // Ensure that Redis configuration is provided if the strategy is REDIS
  if (settings.strategyCache === "REDIS") {
    if (!settings.redis) {
      throw new Error("When the property 'strategyCache' is 'REDIS', the property 'redis' is required.");
    }

    return RedisCacheRepository.getInstance(settings.redis);
  }

  // Return MemoryCacheRepository by default if no valid strategy is matched (fallback safety)
  return MemoryCacheRepository.getInstance();
};
