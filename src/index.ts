import { MemoryCacheRepository } from "./repositories/memory-cache.repository";
import {
  ICache as CustomCache,
  IRateLimitCache as RateLimitCache,
} from "./core/interfaces/cache";
import { ISettings as Settings } from "./core/interfaces/settings";
import { middleware } from "./app/middleware";

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
