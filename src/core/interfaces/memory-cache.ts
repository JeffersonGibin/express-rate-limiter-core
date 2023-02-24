import { IRateLimitCache } from "./cache";

export interface IDatabaseMemory {
  [key: string]: IRateLimitCache;
}
