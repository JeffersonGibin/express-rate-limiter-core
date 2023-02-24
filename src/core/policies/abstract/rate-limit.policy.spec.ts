import { ICache, IRateLimitCache } from "../../../interfaces/cache";
import { PolicieRateLimit } from "../../../interfaces/policies";

import { RateLimitPolicy } from "../abstract/rate-limit.policy";
import { timeWaitingCalculations } from "../../calculations/time-waiting.calculations";
import { requestRemainingCalculations } from "../../calculations/request-remaining.calculations";
import { retryAfterCalculations } from "../../calculations/retry-after.calculations";

jest.mock("../../calculations/request-remaining.calculations");
jest.mock("../../calculations/retry-after.calculations");
jest.mock("../../calculations/time-waiting.calculations");

class TestRateLimitPolicy extends RateLimitPolicy {
  constructor(
    policySettings: PolicieRateLimit,
    responseRateLimitCache: IRateLimitCache,
    repositoryCache: ICache
  ) {
    super(policySettings, responseRateLimitCache, repositoryCache);
  }

  public whenTimeRateLimitReset(): number {
    return 0;
  }
  public validateProps(): RateLimitPolicy {
    return this;
  }
}

// 2023-02-23T13:20:00.000Z
const MOCK_LAST_TIME_REQUEST = 1677158400000;

const rateLimitResetCalculationsFn = jest.fn();
const retryAfterCalculationsFn = jest.fn();
const timeWaitingCalculationsFn = jest.fn();

const saveHitFn = jest.fn();
const updateHitFn = jest.fn();
const deleteHitFn = jest.fn();

const mockCustomCache: ICache = {
  saveHit: saveHitFn,
  updateHit: updateHitFn,
  deleteHit: deleteHitFn,
  getByKey: jest.fn(),
};

describe("rate-limit.policy unit test", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST);

    (requestRemainingCalculations as jest.Mock).mockImplementation(
      rateLimitResetCalculationsFn
    );
    (retryAfterCalculations as jest.Mock).mockImplementation(
      retryAfterCalculationsFn
    );
    (timeWaitingCalculations as jest.Mock).mockImplementation(
      timeWaitingCalculationsFn
    );
  });

  describe("method class amountRequestRemaining", () => {
    it("It's should calll requestRemainingCalculations", () => {
      const instance = new TestRateLimitPolicy(
        {
          type: "REQUEST_PER_SECONDS",
          maxRequests: 10,
          periodWindow: 10,
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        {} as ICache
      );

      instance.amountRequestRemaining();

      expect(rateLimitResetCalculationsFn).toHaveBeenCalled();
    });
  });

  describe("method class timeWaitToRetryAfter", () => {
    it("It's should calll retryAfterCalculations", () => {
      const whenTimeRateLimitResetSpy = jest.spyOn(
        TestRateLimitPolicy.prototype,
        "whenTimeRateLimitReset"
      );

      const instance = new TestRateLimitPolicy(
        {
          type: "REQUEST_PER_SECONDS",
          maxRequests: 10,
          periodWindow: 10,
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        {} as ICache
      );

      instance.timeWaitToRetryAfter();

      expect(whenTimeRateLimitResetSpy).toHaveBeenCalled();
      expect(retryAfterCalculationsFn).toHaveBeenCalled();

      whenTimeRateLimitResetSpy.mockRestore();
    });
  });

  describe("method class waitingTimeIsExpired", () => {
    it("It's should calll waitingTimeIsExpired", () => {
      const timeWaitToRetryAfterSpy = jest.spyOn(
        TestRateLimitPolicy.prototype,
        "timeWaitToRetryAfter"
      );

      const instance = new TestRateLimitPolicy(
        {
          type: "REQUEST_PER_SECONDS",
          maxRequests: 10,
          periodWindow: 10,
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        {} as ICache
      );

      instance.waitingTimeIsExpired();

      expect(timeWaitToRetryAfterSpy).toHaveBeenCalled();
      expect(timeWaitingCalculationsFn).toHaveBeenCalled();

      timeWaitToRetryAfterSpy.mockRestore();
    });

    it("It's should true when time waiting expired", () => {
      (timeWaitingCalculations as jest.Mock).mockReturnValue(
        // 2023-02-23T13:19:50.000Z
        MOCK_LAST_TIME_REQUEST - 10000
      );

      const instance = new TestRateLimitPolicy(
        {
          type: "REQUEST_PER_SECONDS",
          maxRequests: 10,
          periodWindow: 10,
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        {} as ICache
      );

      const result = instance.waitingTimeIsExpired();
      expect(result).toBeTruthy();
    });
  });

  describe("method class saveHit", () => {
    test("It's should call method saveHit the cache", () => {
      const instance = new TestRateLimitPolicy(
        {
          type: "REQUEST_PER_SECONDS",
          maxRequests: 10,
          periodWindow: 10,
        },
        undefined as unknown as IRateLimitCache,
        mockCustomCache
      );

      instance.saveHit("key");

      expect(saveHitFn).toHaveBeenCalled();
    });

    test("It's should call method update it the cache when the number max hits is more than hit cache", () => {
      const instance = new TestRateLimitPolicy(
        {
          type: "REQUEST_PER_SECONDS",
          maxRequests: 11,
          periodWindow: 10,
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      instance.saveHit("key");

      expect(updateHitFn).toHaveBeenCalled();
    });

    test("It's should call method update it the cache when the number max hits is equal hit cache", () => {
      const instance = new TestRateLimitPolicy(
        {
          type: "REQUEST_PER_SECONDS",
          maxRequests: 10,
          periodWindow: 10,
        },
        {
          hits: 10,
          created_at: Date.now(),
          last_time_request: Date.now(),
        },
        mockCustomCache
      );

      instance.saveHit("key");

      expect(updateHitFn).toHaveBeenCalled();
    });
  });
});
