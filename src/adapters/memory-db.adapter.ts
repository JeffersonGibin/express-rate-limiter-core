import { ICache, IRateLimitCache } from "../interfaces/cache";
import { IDatabaseMemory } from "../interfaces/memory-cache";

export class MemoryDBAdapter implements ICache {
  private databaseMemory: IDatabaseMemory;

  constructor() {
    this.databaseMemory = {};
  }

  public saveHit(key: string, value: number): IRateLimitCache {
    const ONE_HIT = 1;
    if (this.databaseMemory[key] === undefined) {
      this.databaseMemory[key] = {
        hits: ONE_HIT,
        last_time: Date.now(),
        created_at: Date.now(),
      };

      return this.databaseMemory[key];
    } else {
      this.databaseMemory[key].hits = value;
      this.databaseMemory[key].last_time = Date.now();

      return this.databaseMemory[key];
    }
  }

  public getByKey(key: string): IRateLimitCache {
    return this.databaseMemory[key];
  }

  public deleteHit(key: string): boolean {
    delete this.databaseMemory[key];

    return this.databaseMemory[key] === undefined;
  }
}
