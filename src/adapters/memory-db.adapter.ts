import { ICache, IResponseHit } from "../interfaces/cache";
import { IDatabaseMemory } from "../interfaces/memory-cache";

export class MemoryDBAdapter implements ICache {
  private databaseMemory: IDatabaseMemory;

  constructor() {
    this.databaseMemory = {};
  }

  public incrementHit(key: string): IResponseHit {
    const ONE_HIT = 1;
    if (this.databaseMemory[key] === undefined) {
      this.databaseMemory[key] = {
        hits: ONE_HIT,
        created_at: Date.now(),
      };

      return this.databaseMemory[key];
    }

    this.databaseMemory[key].hits += ONE_HIT;

    return this.databaseMemory[key];
  }

  public getByKey(key: string): IResponseHit {
    return this.databaseMemory[key];
  }

  public deleteHit(key: string): boolean {
    delete this.databaseMemory[key];

    return this.databaseMemory[key] === undefined;
  }
}
