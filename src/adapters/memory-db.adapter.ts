import { ICache, IResponseHit } from "../interfaces/cache";
import { IDatabaseMemory } from "../interfaces/memory-cache";

const databaseMemory: IDatabaseMemory = {};

export class MemoryDBAdapter implements ICache {
  public incrementHit(key: string): IResponseHit {
    const ONE_HIT = 1;
    if (databaseMemory[key] === undefined) {
      databaseMemory[key] = {
        hits: ONE_HIT,
        timestamp_created: Date.now(),
      };
    }

    databaseMemory[key].hits += ONE_HIT;

    return databaseMemory[key];
  }

  public getByKey(key: string) {
    return databaseMemory[key];
  }

  public decrementHit(key: string): boolean {
    delete databaseMemory[key];

    return databaseMemory[key] === undefined;
  }
}
