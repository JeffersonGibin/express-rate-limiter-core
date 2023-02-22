// import { MemoryDBAdapter } from "./memory-db.adapter";
// import { ONE_HIT } from "../constants/application";

// const DATE_NOW_MOCK = 1676899858076;

// describe("memory-db.adapter unit test", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });

//   test("should increment value in the memory when don't exists key", () => {
//     jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);
//     const instance = new MemoryDBAdapter();

//     const key = "192.168.0.1";
//     const resultBeforeInsert = instance.getByKey(key);
//     instance.saveHit(key, ONE_HIT);
//     const resultAfterInsert = instance.getByKey(key);

//     expect(resultBeforeInsert).toBeUndefined();
//     expect(resultAfterInsert).toEqual({
//       hits: 1,
//       created_at: DATE_NOW_MOCK,
//     });
//   });

//   test("should increment value in the memory when a exists value ", () => {
//     jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);
//     const instance = new MemoryDBAdapter();

//     const key = "192.168.0.1";
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);

//     const result = instance.getByKey(key);

//     expect(result).toEqual({
//       hits: 5,
//       created_at: DATE_NOW_MOCK,
//     });
//   });

//   test("should delete hit the memory", () => {
//     jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);
//     const instance = new MemoryDBAdapter();

//     const key = "192.168.0.1";
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);
//     instance.saveHit(key, ONE_HIT);

//     const beforeDelete = instance.getByKey(key);
//     const resultDelete = instance.deleteHit(key);
//     const afterDelete = instance.getByKey(key);

//     expect(beforeDelete).toEqual({
//       hits: 5,
//       created_at: DATE_NOW_MOCK,
//     });
//     expect(afterDelete).toBeUndefined();
//     expect(resultDelete).toBeTruthy();
//   });
// });
