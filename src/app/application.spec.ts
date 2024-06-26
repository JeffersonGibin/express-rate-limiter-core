import {
  NextFunctionExpress,
  RequestExpress,
  ResponseExpress,
} from "../core/interfaces/express";
import { Application } from "./application";
import { transformHeaderCallsInObject } from "./utils/test.utils";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_TOO_MANY_REQUESTS,
  MESSAGE_DEFAULT_TOOMANY_REQUEST,
  MESSAGE_DEFAULT_UNAUTHORIZED_REQUEST,
  MESSAGE_INVALID_IP,
} from "../core/constants";
import { ArgumentsPolicyDTO } from "./dtos/arguments-policy.dto";
import { RequestExpressDTO } from "./dtos/request-express.dto";
import { ICache } from "../shared/interfaces/cache";

// jest function to represent express response next
const nextFn = jest.fn<NextFunctionExpress, []>();

// jest functions to represent cache functions
const saveHitFn = jest.fn();
const updateHitFn = jest.fn();
const deleteHitFn = jest.fn();
const getByKeyFn = jest.fn();

// mock cache
const mockCustomCache: ICache = {
  saveHit: saveHitFn,
  updateHit: updateHitFn,
  deleteHit: deleteHitFn,
  getByKey: getByKeyFn.mockReturnValue({
    hits: 11,
  }),
};

// jest function to represent express response setHeader
const setHeaderFn = jest.fn();

// 2023-02-23T13:20:00.000Z
const MOCK_LAST_TIME_REQUEST = 1677158400000;

describe("application - integration test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("it should return too many requests", async () => {
    const res = {
      json: jest.fn(),
      setHeader: setHeaderFn,
      status: jest.fn().mockReturnThis(),
    } as unknown as ResponseExpress;

    getByKeyFn.mockResolvedValue({
      hits: 11,
      lastTimeRequest: MOCK_LAST_TIME_REQUEST,
      createdAt: MOCK_LAST_TIME_REQUEST,
    });

    const dateNowSpy = jest
      .spyOn(Date, "now")
      .mockReturnValue(MOCK_LAST_TIME_REQUEST);

    const instance = new Application({
      argumentsPolicyDto: new ArgumentsPolicyDTO({
        type: "REQUEST_PER_MINUTES",
        maxRequests: 10,
        periodWindow: 10,
      }),

      requestExpressDto: new RequestExpressDTO(
        {
          ip: "127.0.0.1",
          app: {
            get: jest.fn(),
          },
          headers: {
            "x-forwarded-for": "",
          },
        } as unknown as RequestExpress,
        res,
        nextFn
      ),
      cache: mockCustomCache,
    });

    // execute application
    await instance.execute();

    // transform header calls in object
    const resultHeadersApplyed = transformHeaderCallsInObject(setHeaderFn);

    expect(resultHeadersApplyed).toStrictEqual({
      "Retry-After": 600,
      "X-RateLimit-Limit": "10",
      "X-RateLimit-Reset": "2023-02-23T13:30:00.000Z",
    });

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_TOO_MANY_REQUESTS);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGE_DEFAULT_TOOMANY_REQUEST,
    });

    dateNowSpy.mockRestore();
  });

  test("it should'nt return too many requests", async () => {
    const res = {
      json: jest.fn(),
      setHeader: setHeaderFn,
      status: jest.fn().mockReturnThis(),
    } as unknown as ResponseExpress;

    getByKeyFn.mockResolvedValue({
      hits: 2,
      lastTimeRequest: MOCK_LAST_TIME_REQUEST,
      createdAt: MOCK_LAST_TIME_REQUEST,
    });

    const dateNowSpy = jest
      .spyOn(Date, "now")
      .mockReturnValue(MOCK_LAST_TIME_REQUEST);

    const instance = new Application({
      argumentsPolicyDto: new ArgumentsPolicyDTO({
        type: "REQUEST_PER_MINUTES",
        maxRequests: 10,
        periodWindow: 10,
      }),

      requestExpressDto: new RequestExpressDTO(
        {
          ip: "127.0.0.1",
          app: {
            get: jest.fn(),
          },
          headers: {
            "x-forwarded-for": "",
          },
        } as unknown as RequestExpress,
        res,
        nextFn
      ),
      cache: mockCustomCache,
    });

    // execute application
    await instance.execute();

    // transform result headers calls in object
    const resultHeadersApplyed = transformHeaderCallsInObject(setHeaderFn);

    expect(resultHeadersApplyed).toStrictEqual({
      "X-RateLimit-Limit": "10",
      "X-RateLimit-Remaining": 8,
    });

    dateNowSpy.mockRestore();
  });

  test("it should return block requests", async () => {
    const res = {
      json: jest.fn(),
      setHeader: setHeaderFn,
      status: jest.fn().mockReturnThis(),
    } as unknown as ResponseExpress;

    // Mock result of cache the getByKey
    getByKeyFn.mockResolvedValue({
      hits: 2,
      lastTimeRequest: MOCK_LAST_TIME_REQUEST,
      createdAt: MOCK_LAST_TIME_REQUEST,
    });

    // spy Date now and mock result
    const dateNowSpy = jest
      .spyOn(Date, "now")
      .mockReturnValue(MOCK_LAST_TIME_REQUEST);

    const instance = new Application({
      argumentsPolicyDto: new ArgumentsPolicyDTO({
        type: "REQUEST_PER_MINUTES",
        maxRequests: 10,
        periodWindow: 10,
      }),

      requestExpressDto: new RequestExpressDTO(
        {
          ip: "127.0.0.1",
          app: {
            get: jest.fn(),
          },
          headers: {
            "x-forwarded-for": "",
          },
        } as unknown as RequestExpress,
        res,
        nextFn
      ),
      cache: mockCustomCache,
      blockRequestRule: () => true,
    });

    // execute application
    await instance.execute();

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGE_DEFAULT_UNAUTHORIZED_REQUEST,
    });

    dateNowSpy.mockRestore();
  });

  test("it should return invalid ip detected", async () => {
    const res = {
      json: jest.fn(),
      setHeader: setHeaderFn,
      status: jest.fn().mockReturnThis(),
    } as unknown as ResponseExpress;

    getByKeyFn.mockResolvedValue({
      hits: 11,
      lastTimeRequest: MOCK_LAST_TIME_REQUEST,
      createdAt: MOCK_LAST_TIME_REQUEST,
    });

    const dateNowSpy = jest
      .spyOn(Date, "now")
      .mockReturnValue(MOCK_LAST_TIME_REQUEST);

    const instance = new Application({
      argumentsPolicyDto: new ArgumentsPolicyDTO({
        type: "REQUEST_PER_MINUTES",
        maxRequests: 10,
        periodWindow: 10,
      }),

      requestExpressDto: new RequestExpressDTO(
        {
          app: {
            get: jest.fn(),
          },
          headers: {
            "x-forwarded-for": "a",
          },
        } as unknown as RequestExpress,
        res,
        nextFn
      ),
      cache: mockCustomCache,
    });

    // execute application
    await instance.execute();

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: MESSAGE_INVALID_IP,
    });

    dateNowSpy.mockRestore();
  });
});
