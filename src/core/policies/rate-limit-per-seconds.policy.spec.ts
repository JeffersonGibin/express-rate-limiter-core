import { ICache } from "../../interfaces/cache";
import { RateLimitPerSecondsPolicy } from "./rate-limit-per-seconds.policy";
import { ValidationHandler } from "../../core/validations/validation-handler";
import { rateLimitResetCalculations } from "../../application/calculations/rate-limit-reset.calculations";

jest.mock("../../core/validations/validation-handler");
jest.mock("../../application/calculations/rate-limit-reset.calculations");

describe("rate-limit-per-seconds.policy unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("method class validateProps", () => {
    test("it's should call ValidationHandler", () => {
      const validationHandlerspy = jest.spyOn(
        ValidationHandler.prototype,
        "execute"
      );
      const instance = new RateLimitPerSecondsPolicy(
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

      instance.validateProps();

      expect(validationHandlerspy).toBeCalled();

      validationHandlerspy.mockRestore();
    });
  });

  describe("method class whenTimeRateLimitReset", () => {
    test("it's should call rateLimitResetCalculations", () => {
      const rateLimitResetCalculationsFn = jest.fn();
      (rateLimitResetCalculations as jest.Mock).mockImplementationOnce(
        rateLimitResetCalculationsFn
      );

      const instance = new RateLimitPerSecondsPolicy(
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

      instance.whenTimeRateLimitReset();

      expect(rateLimitResetCalculationsFn).toBeCalled();
    });
  });
});
