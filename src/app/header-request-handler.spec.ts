import { HeaderRequestHandler } from "./header-request-handler";
import { transformHeaderCallsInObject } from "./utils/test.utils";
import { RequestExpressDTO } from "../app/dtos/request-express.dto";
import { RequestExpress, ResponseExpress } from "../core/interfaces/express";
import { RateLimitPolicy } from "../core/policies/abstract/rate-limit.policy";

// 2023-02-23T13:20:00.000Z
const MOCK_LAST_TIME_REQUEST = 1677158400000;

const setHeaderFn = jest.fn();

const req = {} as RequestExpress;
const res = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
  setHeader: setHeaderFn,
} as unknown as ResponseExpress;

describe("header-request-handler unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("method class applyCommonHeaders", () => {
    test("it's should apply the limit and remaining headers when number remaining is more than zero", () => {
      const headerInstance = new HeaderRequestHandler(
        { req, res, next: jest.fn() } as unknown as RequestExpressDTO,
        {
          amountRequestRemaining: jest.fn().mockReturnValue(5),
        } as unknown as RateLimitPolicy,
        {
          hits: 10,
          createdAt: Date.now(),
          lastTimeRequest: Date.now(),
        }
      );

      headerInstance.applyCommonHeaders(10);

      const headersResult = transformHeaderCallsInObject(setHeaderFn);

      expect(headersResult).toEqual({
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": 5,
      });
    });

    test("it's should apply only header 'X-RateLimit-Limit'", () => {
      const headerInstance = new HeaderRequestHandler(
        { req, res, next: jest.fn() } as unknown as RequestExpressDTO,
        {
          amountRequestRemaining: jest.fn().mockReturnValue(-1),
        } as unknown as RateLimitPolicy,
        {
          hits: 10,
          createdAt: Date.now(),
          lastTimeRequest: Date.now(),
        }
      );

      headerInstance.applyCommonHeaders(10);

      const headersResult = transformHeaderCallsInObject(setHeaderFn);

      expect(headersResult).toEqual({
        "X-RateLimit-Limit": "10",
      });
    });
  });

  describe("method class applyRateLimitReset", () => {
    test("it's should apply the 'X-RateLimit-Reset' header when the number hits more than the max hits", () => {
      const headerInstance = new HeaderRequestHandler(
        { req, res, next: jest.fn() } as unknown as RequestExpressDTO,
        {
          whenTimeRateLimitReset: jest
            .fn()
            .mockReturnValue(MOCK_LAST_TIME_REQUEST),
        } as unknown as RateLimitPolicy,
        {
          hits: 11,
          createdAt: Date.now(),
          lastTimeRequest: Date.now(),
        }
      );

      headerInstance.applyRateLimitReset(10);

      const headersResult = transformHeaderCallsInObject(setHeaderFn);

      expect(headersResult).toEqual({
        "X-RateLimit-Reset": "2023-02-23T13:20:00.000Z",
      });
    });
  });

  describe("method class applyRetryAfter", () => {
    test("it's should apply the 'Retry-After' header when number hits more than max hits", () => {
      const headerInstance = new HeaderRequestHandler(
        { req, res, next: jest.fn() } as unknown as RequestExpressDTO,
        {
          timeWaitToRetryAfter: jest.fn().mockReturnValue(600),
        } as unknown as RateLimitPolicy,
        {
          hits: 11,
          createdAt: Date.now(),
          lastTimeRequest: Date.now(),
        }
      );

      headerInstance.applyRetryAfter(10);

      const headersResult = transformHeaderCallsInObject(setHeaderFn);

      expect(headersResult).toEqual({
        "Retry-After": 600,
      });
    });
  });
});
