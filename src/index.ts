import { MemoryDBAdapter as MemoryDB} from "./adapters/memory-db.adapter";
import { middleware } from "./middleware";

/**
 * Application
 */
export const RateLimitExpress = middleware;

/**
 * Adapter that works in memory.
 */
export const MemoryDBAdapter = MemoryDB;