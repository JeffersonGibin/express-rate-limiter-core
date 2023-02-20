import { ICache, IResponseHit } from "../interfaces/cache";
import { RateLimit } from "./rate-limit";

const incrementHitFn = jest.fn();
const deleteHitFn = jest.fn();

const responseCache: IResponseHit = {
  created_at: 0,
  hits: 1,
};

const adapterCacheMock: ICache = {
  incrementHit: incrementHitFn,
  deleteHit: deleteHitFn,
  getByKey: function (key: string): IResponseHit {
    if (key) {
      return responseCache;
    }

    return {} as IResponseHit;
  },
};

describe("rate-limit unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    test("should set the correct properties in the constructor correctly", () => {
      const rateLimit = new RateLimit({
        cache: adapterCacheMock,
        maxRequest: 10,
        rateLimitWindow: 60,
        ip: "127.0.0.1",
      });

      expect(rateLimit).toMatchObject({
        settings: {
          cache: adapterCacheMock,
          maxRequest: 10,
          rateLimitWindow: 60,
        },
        ip: "127.0.0.1",
      });
    });

    test("should throw an error if the ip parameter is invalid", () => {
      expect(() => {
        new RateLimit({
          cache: adapterCacheMock,
          maxRequest: 10,
          rateLimitWindow: 60,
          ip: undefined as unknown as string,
        });
      }).toThrow("Invalid IP address");
    });

    test("should throw an error if the cache parameter is invalid", () => {
      expect(() => {
        new RateLimit({
          cache: undefined as unknown as ICache,
          maxRequest: 10,
          rateLimitWindow: 60,
          ip: "127.0.0.1",
        });
      }).toThrow("Invalid cache object");
    });

    test("should throw an error if the maxRequest parameter is invalid", () => {
      expect(() => {
        new RateLimit({
          cache: adapterCacheMock,
          maxRequest: undefined as unknown as number,
          rateLimitWindow: 60,
          ip: "127.0.0.1",
        });
      }).toThrow("Invalid maxRequest value");

      expect(() => {
        new RateLimit({
          cache: adapterCacheMock,
          maxRequest: -1,
          rateLimitWindow: 60,
          ip: "127.0.0.1",
        });
      }).toThrow("Invalid maxRequest value");
    });

    test("should throw an error if the rateLimitWindow parameter is invalid", () => {
      expect(() => {
        new RateLimit({
          cache: adapterCacheMock,
          maxRequest: 10,
          rateLimitWindow: undefined as unknown as number,
          ip: "127.0.0.1",
        });
      }).toThrow("Invalid rateLimitWindow value");

      expect(() => {
        new RateLimit({
          cache: adapterCacheMock,
          maxRequest: 10,
          rateLimitWindow: -1,
          ip: "127.0.0.1",
        });
      }).toThrow("Invalid rateLimitWindow value");
    });
  });

  describe("method processLimitCache", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("should delete hit when current date is greater than expiry calculation", () => {
      const DATE_NOW_MOCK = 1676899858076;
      const CREATED_AT_MOCK = 1676899798076;

      jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);

      const rateLimit = new RateLimit({
        cache: adapterCacheMock,
        maxRequest: 10,
        rateLimitWindow: 60,
        ip: "127.0.0.1",
      });

      rateLimit.processHit({
        created_at: CREATED_AT_MOCK,
        hits: 1,
      });

      expect(deleteHitFn).toBeCalled();
    });

    test("should increment hit when the maximum allowable limit is greater than or equal to cache hits", () => {
      const DATE_NOW_MOCK = 1676899858076;
      const CREATED_AT_MOCK = 1676899858076;

      jest.spyOn(Date, "now").mockReturnValue(DATE_NOW_MOCK);

      const rateLimit = new RateLimit({
        cache: adapterCacheMock,
        maxRequest: 10,
        rateLimitWindow: 60,
        ip: "127.0.0.1",
      });

      rateLimit.processHit({
        created_at: CREATED_AT_MOCK,
        hits: 1,
      });

      expect(incrementHitFn).toBeCalled();
    });
  });
});
