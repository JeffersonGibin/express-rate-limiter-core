import { MemoryCacheRepository } from "./repositories/memory-cache.repository";
import { ICache, IRateLimitCache } from "./interfaces/cache";
import { ISettings } from "./interfaces/settings";
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
export { ICache, IRateLimitCache, ISettings };
