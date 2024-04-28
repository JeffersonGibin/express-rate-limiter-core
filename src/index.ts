import * as Redis from "redis";
import { MemoryCacheRepository } from "./shared/repositories/memory-cache.repository";
import { ICache as CustomCache, IRateLimitCache as RateLimitCache } from "./shared/interfaces/cache";

import { ISettings as Settings } from "./shared/interfaces/settings";
import { middleware } from "./shared/middleware";

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
export { CustomCache, RateLimitCache, Settings, Redis };
