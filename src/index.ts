import { MemoryCacheRepository } from "./repositories/memory-cache.repository";
import {
  ICache as CustomCache,
  IRateLimitCache as RateLimitCache,
} from "./interfaces/cache";
import { ISettings as Settings } from "./interfaces/settings";
import { middleware } from "./middleware";

/**
 * Application
 */
export const RateLimitExpress = middleware;

/**
 * Repository that works in memory.
 */
export const MemoryCache = MemoryCacheRepository;

/**
 * Interfaces Types
 */
export { CustomCache, RateLimitCache, Settings };
