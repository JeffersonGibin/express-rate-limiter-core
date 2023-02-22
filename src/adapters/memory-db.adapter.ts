import { ICache, IRateLimitCache } from "../interfaces/cache";
import { IDatabaseMemory } from "../interfaces/memory-cache";

export class MemoryDBAdapter implements ICache {
  private databaseMemory: IDatabaseMemory;

  constructor() {
    this.databaseMemory = {};
  }

  public saveHit(key: string, newHit: number): IRateLimitCache {
    this.databaseMemory[key] = {
      hits: newHit,
      last_time_request: Date.now(),
      created_at: Date.now(),
    };

    return this.databaseMemory[key];
  }

  updateHit(key: string, newHit: number): IRateLimitCache {
    this.databaseMemory[key].hits = newHit;
    this.databaseMemory[key].last_time_request = Date.now();

    return this.databaseMemory[key];
  }

  public getByKey(key: string): IRateLimitCache {
    return this.databaseMemory[key];
  }

  public deleteHit(key: string): boolean {
    delete this.databaseMemory[key];

    return this.databaseMemory[key] === undefined;
  }
}
