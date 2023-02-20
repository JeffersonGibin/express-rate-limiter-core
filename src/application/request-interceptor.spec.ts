import { ICache } from "../interfaces/cache";
import { RateLimit } from "./rate-limit";
import { RequestInterceptor } from "./request-interceptor";

import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";
import { HTTP_STATUS_TOO_MANY_REQUESTS } from "../constants/application";

jest.mock("./rate-limit");

const rateLimitProcessHitFn = jest.fn();
const setHeaderExpressFn = jest.fn();
const sendExpressFn = jest.fn();
const responseStatusExpressFn = jest.fn(() => HTTP_STATUS_TOO_MANY_REQUESTS);

const req = {} as IExpressRequest;
const res = {
  setHeader: setHeaderExpressFn,
  status: responseStatusExpressFn.mockReturnThis(),
  send: sendExpressFn,
} as unknown as IExpressResponse;
const nextFn = jest.fn<INextFunctionExpress, []>();

const cache = {} as ICache;
const mockRateLimit = {
  processHit: rateLimitProcessHitFn,
} as unknown as RateLimit;

const maxRequest = 10;
const rateLimitWindow = 10;

describe("request-interceptor unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should set the correct properties in the constructor correctly", () => {
    const requestParam = {
      req,
      res,
      next: nextFn,
    };

    const interceptor = new RequestInterceptor({
      cache,
      rateLimit: mockRateLimit,
      requestParam,
      maxRequest,
      rateLimitWindow,
    });

    expect(interceptor).toMatchObject({
      input: {
        cache,
        rateLimit: mockRateLimit,
        requestParam,
        maxRequest,
        rateLimitWindow,
      },
    });
  });

  test("should to call execute method with successfully when the hits limit has not been reached", () => {
    const DATE_NOW_MOCK = 1676899858076;

    const cacheMock = {
      getByKey: jest.fn().mockReturnValue({
        hits: 1,
        created_at: DATE_NOW_MOCK,
      }),
    } as unknown as ICache;

    const requestParam = {
      req,
      res,
      next: nextFn,
    };

    const interceptor = new RequestInterceptor({
      cache: cacheMock,
      rateLimit: mockRateLimit,
      requestParam,
      maxRequest,
      rateLimitWindow,
    });

    interceptor.execute();

    expect(setHeaderExpressFn).toBeCalledWith(
      "X-RateLimit-Limit",
      maxRequest.toString()
    );
    expect(nextFn).toBeCalledTimes(1);
    expect(rateLimitProcessHitFn).toBeCalledTimes(1);
  });

  test("should to call execute method with successfully when the hits limit has reached", () => {
    const DATE_NOW_MOCK = 1676899858076;
    const CREATED_AT_MOCK = 1676899858076;
    const THREE_TIMES_EXECUTE = 3;

    jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);
    jest.spyOn(Date.prototype, "getTime").mockReturnValue(DATE_NOW_MOCK);

    const cacheMock = {
      getByKey: jest.fn().mockReturnValue({
        hits: 10,
        created_at: CREATED_AT_MOCK,
      }),
    } as unknown as ICache;

    const requestParam = {
      req,
      res: {
        setHeader: setHeaderExpressFn,
        status: responseStatusExpressFn.mockReturnThis(),
        send: sendExpressFn,
      } as unknown as IExpressResponse,
      next: nextFn,
    };

    const interceptor = new RequestInterceptor({
      cache: cacheMock,
      rateLimit: mockRateLimit,
      requestParam,
      maxRequest,
      rateLimitWindow,
    });

    interceptor.execute();

    const [headerLimit, headerReset, headerAfter] =
      setHeaderExpressFn.mock.calls;

    expect(headerLimit).toEqual(["X-RateLimit-Limit", "10"]);
    expect(headerReset).toEqual(["X-RateLimit-Reset", 1676899858077]);
    expect(headerAfter).toEqual(["Retry-After", "1"]);
    expect(setHeaderExpressFn).toBeCalledTimes(THREE_TIMES_EXECUTE);

    expect(responseStatusExpressFn).toBeCalledWith(
      HTTP_STATUS_TOO_MANY_REQUESTS
    );

    expect(sendExpressFn).toBeCalledWith({
      message: "Too many requests",
    });
  });
});
