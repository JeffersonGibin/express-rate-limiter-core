import { ICache, IRateLimitCache } from "../interfaces/cache";

interface IDatabaseMemory {
  [key: string]: IRateLimitCache;
}

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
      lastTimeRequest: Date.now(),
      createdAt: Date.now(),
    };

    return this.databaseMemory[key];
  }

  public async updateHit(
    key: string,
    newHit: number
  ): Promise<IRateLimitCache> {
    this.databaseMemory[key].hits = newHit;
    this.databaseMemory[key].lastTimeRequest = Date.now();

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
