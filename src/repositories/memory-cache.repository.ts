import { ICache, IRateLimitCache } from "../core/interfaces/cache";
import { IDatabaseMemory } from "../core/interfaces/memory-cache";

export class MemoryCacheRepository implements ICache {
  private databaseMemory: IDatabaseMemory;

  private static instance: MemoryCacheRepository;

  constructor() {
    this.databaseMemory = {};
  }

  static getInstance(): MemoryCacheRepository {
    if (!MemoryCacheRepository.instance) {
      MemoryCacheRepository.instance = new MemoryCacheRepository();
    }
    return MemoryCacheRepository.instance;
  }

  public async saveHit(key: string, newHit: number): Promise<IRateLimitCache> {
    this.databaseMemory[key] = {
      hits: newHit,
      last_time_request: Date.now(),
      created_at: Date.now(),
    };

    return this.databaseMemory[key];
  }

  public async updateHit(
    key: string,
    newHit: number
  ): Promise<IRateLimitCache> {
    this.databaseMemory[key].hits = newHit;
    this.databaseMemory[key].last_time_request = Date.now();

    return this.databaseMemory[key];
  }

  public async getByKey(key: string): Promise<IRateLimitCache> {
    return this.databaseMemory[key];
  }

  public async deleteHit(key: string): Promise<boolean> {
    delete this.databaseMemory[key];

    return this.databaseMemory[key] === undefined;
  }
}
