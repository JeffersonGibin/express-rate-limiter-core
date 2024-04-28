import { ISettings } from "./interfaces/settings";
import { MemoryCacheRepository } from "./repositories/memory-cache.repository";
import { RedisCacheRepository } from "./repositories/redis-cache.repository";
import { getStrategyCache } from "./get-strategy-cache";
import { RedisCache } from "./interfaces/cache";

jest.mock("./repositories/memory-cache.repository");
jest.mock("./repositories/redis-cache.repository");

const settingsBase: ISettings = {
	policy: {
		type: "REQUEST_PER_SECONDS",
		periodWindow: 10,
		maxRequests: 10,
	},
};

describe("getStrategyCache unit test", () => {
	beforeEach(() => {
		(RedisCacheRepository.getInstance as jest.Mock).mockReturnValue(
			new RedisCacheRepository({} as unknown as RedisCache)
		);
		(MemoryCacheRepository.getInstance as jest.Mock).mockReturnValue(
			new MemoryCacheRepository()
		);
	});

	it("should return an instance of MemoryCacheRepository when no strategy is specified", () => {
		const settings = settingsBase;
		expect(getStrategyCache(settings)).toBeInstanceOf(MemoryCacheRepository);
	});

	it("should return an instance of MemoryCacheRepository when strategy is IN_MEMORY", () => {
		const settings: ISettings = { ...settingsBase, strategyCache: "IN_MEMORY" };
		expect(getStrategyCache(settings)).toBeInstanceOf(MemoryCacheRepository);
	});

	it("should throw an error when strategy is CUSTOM without a cache implementation", () => {
		const settings: ISettings = {
			...settingsBase,
			strategyCache: "CUSTOM",
			cache: undefined,
		} as unknown as ISettings;
		expect(() => getStrategyCache(settings)).toThrow(
			"When the property 'strategyCache' is 'CUSTOM', the property 'cache' is required."
		);
	});

	it("should return a custom cache implementation when strategy is CUSTOM with a cache", () => {
		const customCache = { set: jest.fn(), get: jest.fn() };
		const settings: ISettings = {
			...settingsBase,
			strategyCache: "CUSTOM",
			cache: customCache,
		} as unknown as ISettings;

		expect(getStrategyCache(settings)).toEqual(customCache);
	});

	it("should throw an error when strategy is REDIS without Redis configuration", () => {
		const settings: ISettings = {
			...settingsBase,
			strategyCache: "REDIS",
		} as unknown as ISettings;

		expect(() => getStrategyCache(settings)).toThrow(
			"When the property 'strategyCache' is 'REDIS', the property 'redis' is required."
		);
	});

	it("should return an instance of RedisCacheRepository when strategy is REDIS with Redis configuration", () => {
		const redisClient = {} as RedisCache;

		const settings: ISettings = {
			strategyCache: "REDIS",
			redis: redisClient,
			policy: {
				type: "REQUEST_PER_SECONDS",
				periodWindow: 10,
				maxRequests: 10,
			},
		};

		expect(getStrategyCache(settings)).toBeInstanceOf(RedisCacheRepository);
	});
});
