import { MemoryCacheRepository } from "./memory-cache.repository";

const DATE_NOW_MOCK = 1677162014139;

describe("memory-db.adapter unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);
  });

  test("it's should save value in the memory", async () => {
    const instance = MemoryCacheRepository.getInstance();

    const key = "192.168.0.1";
    const resultBeforeInsert = await instance.getByKey(key);
    instance.saveHit(key, 1);
    const resultAfterInsert = await instance.getByKey(key);

    expect(resultBeforeInsert).toBeUndefined();
    expect(resultAfterInsert).toEqual({
      hits: 1,
      lastTimeRequest: DATE_NOW_MOCK,
      createdAt: DATE_NOW_MOCK,
    });
  });

  test("it's should update value in the memory", async () => {
    const instance = MemoryCacheRepository.getInstance();

    const key = "192.168.0.1";
    await instance.saveHit(key, 1);
    const result = await instance.updateHit(key, 5);

    expect(result).toStrictEqual({
      hits: 5,
      lastTimeRequest: DATE_NOW_MOCK,
      createdAt: DATE_NOW_MOCK,
    });
  });

  test("it's should return a value in the memory", async () => {
    const instance = MemoryCacheRepository.getInstance();

    const key = "192.168.0.1";
    await instance.saveHit(key, 1);
    const result = await instance.getByKey(key);

    expect(result).toStrictEqual({
      hits: 1,
      lastTimeRequest: DATE_NOW_MOCK,
      createdAt: DATE_NOW_MOCK,
    });
  });

  test("it's should delete hit the memory", async () => {
    const instance = MemoryCacheRepository.getInstance();

    const key = "192.168.0.1";
    await instance.saveHit(key, 1);

    const beforeDelete = await instance.getByKey(key);
    const resultDelete = await instance.deleteHit(key);
    const afterDelete = await instance.getByKey(key);

    expect(beforeDelete).toEqual({
      hits: 1,
      lastTimeRequest: DATE_NOW_MOCK,
      createdAt: DATE_NOW_MOCK,
    });
    expect(afterDelete).toBeUndefined();
    expect(resultDelete).toBeTruthy();
  });

  test("When there are multiple instances should have the same result", async () => {
    const key = "key_instance_one";

    // save value in the instance one
    const instanceOne = MemoryCacheRepository.getInstance();
    await instanceOne.saveHit(key, 999);

    // get value saved in the instance one in the instance two
    const instanceTwo = MemoryCacheRepository.getInstance();
    const resultInstanceTwo = await instanceTwo.getByKey(key);

    expect(resultInstanceTwo).toStrictEqual({
      hits: 999,
      lastTimeRequest: DATE_NOW_MOCK,
      createdAt: DATE_NOW_MOCK,
    });
  });
});
