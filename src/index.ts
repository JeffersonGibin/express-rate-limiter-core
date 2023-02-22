import { MemoryCacheAdapter as CacheMemory } from "./adapters/memory-cache.adapter";
import { ICache, IRateLimitCache } from "./interfaces/cache";
import { ISettings } from "./interfaces/settings";
import { middleware } from "./middleware";

/**
 * Application
 */
export const RateLimitExpress = middleware;

/**
 * Adapter that works in memory.
 */
export const MemoryCacheAdapter = CacheMemory;

/**
 * Interfaces Types
 */
export { ICache, IRateLimitCache, ISettings };
