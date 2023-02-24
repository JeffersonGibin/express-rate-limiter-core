import { ICache, IRateLimitCache } from "../../interfaces/cache";
import { RateLimitPerPeriodPolicy } from "./rate-limit-per-period.policy";
import { ValidationHandler } from "../validations/validation-handler";

jest.mock("../validations/validation-handler");

// 2023-02-23T13:20:00.000Z
const MOCK_LAST_TIME_REQUEST = 1677158400000;

const saveHitFn = jest.fn();
const updateHitFn = jest.fn();
const deleteHitFn = jest.fn();

const mockCustomCache: ICache = {
  saveHit: saveHitFn,
  updateHit: updateHitFn,
  deleteHit: deleteHitFn,
  getByKey: jest.fn(),
};

describe("rate-limit-per-period.policy unit test", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST);
  });

  describe("method class validateProps", () => {
    test("it's should call ValidationHandler", () => {
      const validationHandlerspy = jest.spyOn(
        ValidationHandler.prototype,
        "execute"
      );
      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(),
          periodWindowEnd: new Date(),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      instance.validateProps();

      expect(validationHandlerspy).toBeCalled();

      validationHandlerspy.mockRestore();
    });
  });

  describe("method class whenTimeRateLimitReset", () => {
    test("it's should return last time request", () => {
      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(),
          periodWindowEnd: new Date(MOCK_LAST_TIME_REQUEST),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      const result = instance.whenTimeRateLimitReset();

      expect(result).toBe(MOCK_LAST_TIME_REQUEST);
    });
  });

  describe("method class waitingTimeIsExpired", () => {
    test("it's should return true when the waiting time is expired", () => {
      // 2023-02-23T13:20:10.000Z
      jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST + 10000);

      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(),
          periodWindowEnd: new Date(MOCK_LAST_TIME_REQUEST),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      const result = instance.waitingTimeIsExpired();

      expect(result).toBeTruthy();
    });

    test("it's should return false when the waiting time isn't expired", () => {
      // 2023-02-23T13:19:50.000Z
      jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST - 10000);

      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(),
          periodWindowEnd: new Date(MOCK_LAST_TIME_REQUEST),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        {} as ICache
      );

      const result = instance.waitingTimeIsExpired();

      expect(result).toBeFalsy();
    });
  });

  describe("method class saveHit", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("It's should call method saveHit the cache", async () => {
      // 2023-02-23T13:19:50.000Z
      const periodWindowStartMock = MOCK_LAST_TIME_REQUEST - 10000;

      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(periodWindowStartMock),
          periodWindowEnd: new Date(),
        },
        undefined as unknown as IRateLimitCache,
        mockCustomCache
      );

      await instance.saveHit("key");

      expect(saveHitFn).toHaveBeenCalled();
    });

    test("It's should call method update it the cache when the number max hits is more than hit cache", async () => {
      const periodWindowStartMock = MOCK_LAST_TIME_REQUEST - 10000;

      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(periodWindowStartMock),
          periodWindowEnd: new Date(),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      await instance.saveHit("key");

      expect(updateHitFn).toHaveBeenCalled();
    });

    test("It's should call method update it the cache when the number max hits is equal hit cache", async () => {
      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(),
          periodWindowEnd: new Date(),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      await instance.saveHit("key");

      expect(updateHitFn).toHaveBeenCalled();
    });

    test("It's should call method delete it the cache when the time waiting expired", async () => {
      jest
        .spyOn(RateLimitPerPeriodPolicy.prototype, "waitingTimeIsExpired")
        .mockReturnValue(true);

      const periodWindowStartMock = MOCK_LAST_TIME_REQUEST - 10000;
      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(periodWindowStartMock),
          periodWindowEnd: new Date(),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      await instance.saveHit("key");

      expect(deleteHitFn).toHaveBeenCalled();
    });

    test("It's shouldn't execute nothing when the period don't start", async () => {
      // 2023-02-23T13:19:50.000Z
      const periodDontStart = MOCK_LAST_TIME_REQUEST - 10000;
      jest.spyOn(Date, "now").mockReturnValue(periodDontStart);

      jest
        .spyOn(RateLimitPerPeriodPolicy.prototype, "waitingTimeIsExpired")
        .mockReturnValue(true);

      const instance = new RateLimitPerPeriodPolicy(
        {
          type: "REQUEST_PER_PERIOD",
          maxRequests: 10,
          periodWindowStart: new Date(MOCK_LAST_TIME_REQUEST),
          periodWindowEnd: new Date(MOCK_LAST_TIME_REQUEST),
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      await instance.saveHit("key");

      expect(saveHitFn).not.toBeCalled();
      expect(updateHitFn).not.toBeCalled();
      expect(deleteHitFn).not.toBeCalled();
    });
  });
});
