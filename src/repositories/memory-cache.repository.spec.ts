import { RATE_LIMIT_ONE_HIT } from "../constants";
import { MemoryCacheRepository } from "./memory-cache.repository";

const DATE_NOW_MOCK = 1677162014139;

describe("memory-db.adapter unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);
  });

  test("it's should save value in the memory", async () => {
    const instance = new MemoryCacheRepository();

    const key = "192.168.0.1";
    const resultBeforeInsert = await instance.getByKey(key);
    instance.saveHit(key, RATE_LIMIT_ONE_HIT);
    const resultAfterInsert = await instance.getByKey(key);

    expect(resultBeforeInsert).toBeUndefined();
    expect(resultAfterInsert).toEqual({
      hits: 1,
      last_time_request: DATE_NOW_MOCK,
      created_at: DATE_NOW_MOCK,
    });
  });

  test("it's should update value in the memory", async () => {
    const instance = new MemoryCacheRepository();

    const key = "192.168.0.1";
    await instance.saveHit(key, RATE_LIMIT_ONE_HIT);
    const result = await instance.updateHit(key, 5);

    expect(result).toStrictEqual({
      hits: 5,
      last_time_request: DATE_NOW_MOCK,
      created_at: DATE_NOW_MOCK,
    });
  });

  test("it's should return a value in the memory", async () => {
    const instance = new MemoryCacheRepository();

    const key = "192.168.0.1";
    await instance.saveHit(key, RATE_LIMIT_ONE_HIT);
    const result = await instance.getByKey(key);

    expect(result).toStrictEqual({
      hits: 1,
      last_time_request: DATE_NOW_MOCK,
      created_at: DATE_NOW_MOCK,
    });
  });

  test("it's should delete hit the memory", async () => {
    const instance = new MemoryCacheRepository();

    const key = "192.168.0.1";
    await instance.saveHit(key, RATE_LIMIT_ONE_HIT);

    const beforeDelete = await instance.getByKey(key);
    const resultDelete = await instance.deleteHit(key);
    const afterDelete = await instance.getByKey(key);

    expect(beforeDelete).toEqual({
      hits: 1,
      last_time_request: DATE_NOW_MOCK,
      created_at: DATE_NOW_MOCK,
    });
    expect(afterDelete).toBeUndefined();
    expect(resultDelete).toBeTruthy();
  });
});
