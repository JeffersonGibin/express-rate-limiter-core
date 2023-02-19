import { MemoryDBAdapter as MemoryDB } from "./adapters/memory-db.adapter";
import { ICache, IResponseHit } from "./interfaces/cache";
import { ISettings } from "./interfaces/settings";
import { middleware } from "./middleware";

/**
 * Application
 */
export const RateLimitExpress = middleware;

/**
 * Adapter that works in memory.
 */
export const MemoryDBAdapter = MemoryDB;

/**
 * Interfaces Types
 */
export { ICache, IResponseHit, ISettings };
