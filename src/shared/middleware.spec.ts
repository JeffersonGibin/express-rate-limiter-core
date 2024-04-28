import { middleware } from "./middleware";

import { ArgumentsPolicyDTO } from "../app/dtos/arguments-policy.dto";
import { RequestExpressDTO } from "../app/dtos/request-express.dto";
import { ICache, RedisCache } from "../shared/interfaces/cache";
import { RequestExpress, ResponseExpress, NextFunctionExpress } from "../core/interfaces/express";
import { getStrategyCache } from "./get-strategy-cache";
import { Application } from "../app/application";

jest.mock("../app/application");
jest.mock("../app/dtos/arguments-policy.dto");
jest.mock("../app/dtos/request-express.dto");
jest.mock("./get-strategy-cache.ts");

const req = {} as RequestExpress;
const res = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
} as unknown as ResponseExpress;
const nextFn = jest.fn<NextFunctionExpress, []>();

const requestExpressDtoFn = jest.fn();
const argumentsPolicyftoFn = jest.fn();
const constructorApplicationFn = jest.fn();
const strategyCacheFn = jest.fn();

describe("middleware unit test", () => {
  beforeEach(() => {
    (Application as jest.Mock).mockImplementation(constructorApplicationFn);
    (RequestExpressDTO as jest.Mock).mockImplementation(requestExpressDtoFn);
    (ArgumentsPolicyDTO as jest.Mock).mockImplementation(argumentsPolicyftoFn);
    (getStrategyCache as jest.Mock).mockImplementation(strategyCacheFn);
  });

  test("it should call apply function correctly when strategy cache is in memory (without strategyCache)", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");

    const mw = middleware({
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
    });

    mw.apply(req, res, nextFn);

    expect(strategyCacheFn).toHaveBeenCalled();
    expect(constructorApplicationFn).toHaveBeenCalled();
    expect(argumentsPolicyftoFn).toHaveBeenCalled();
    expect(requestExpressDtoFn).toHaveBeenCalled();
    expect(spyApply).toHaveBeenCalled();

    spyApply.mockRestore();
  });

  test("it should call apply function correctly when strategy cache is in memory (with strategyCache)", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");

    const mw = middleware({
      strategyCache: "IN_MEMORY",
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
    });

    mw.apply(req, res, nextFn);

    expect(strategyCacheFn).toHaveBeenCalled();
    expect(constructorApplicationFn).toHaveBeenCalled();
    expect(argumentsPolicyftoFn).toHaveBeenCalled();
    expect(requestExpressDtoFn).toHaveBeenCalled();
    expect(spyApply).toHaveBeenCalled();

    spyApply.mockRestore();
  });

  test("it should call apply function correctly when strategy cache is custom", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");

    const mw = middleware({
      strategyCache: "CUSTOM",
      cache: {} as ICache,
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
    });

    mw.apply(req, res, nextFn);

    expect(strategyCacheFn).toHaveBeenCalled();
    expect(constructorApplicationFn).toHaveBeenCalled();
    expect(argumentsPolicyftoFn).toHaveBeenCalled();
    expect(requestExpressDtoFn).toHaveBeenCalled();
    expect(spyApply).toHaveBeenCalled();

    spyApply.mockRestore();
  });

  test("it should call apply function correctly when strategy cache is redis", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");

    const mw = middleware({
      strategyCache: "REDIS",
      redis: {} as RedisCache,
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
    });

    mw.apply(req, res, nextFn);

    expect(strategyCacheFn).toHaveBeenCalled();
    expect(constructorApplicationFn).toHaveBeenCalled();
    expect(argumentsPolicyftoFn).toHaveBeenCalled();
    expect(requestExpressDtoFn).toHaveBeenCalled();
    expect(spyApply).toHaveBeenCalled();

    spyApply.mockRestore();
  });

  test("it should call apply function correctly when receive blockRequestRule", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");

    const mw = middleware({
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
      blockRequestRule: () => {
        return true;
      },
    });

    mw.apply(req, res, nextFn);

    expect(strategyCacheFn).toHaveBeenCalled();
    expect(constructorApplicationFn).toHaveBeenCalled();
    expect(argumentsPolicyftoFn).toHaveBeenCalled();
    expect(requestExpressDtoFn).toHaveBeenCalled();
    expect(spyApply).toHaveBeenCalled();

    spyApply.mockRestore();
  });

  test("it should catch and handle errors", () => {
    const executeSpy = jest.spyOn(Application.prototype, "execute").mockImplementation(() => {
      throw new Error("Simulate Error!");
    });

    middleware({
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
    }).apply(req, res, nextFn);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      from: "Express Rate Limit Core",
      type: "Error",
      message: "Simulate Error!",
    });

    executeSpy.mockRestore();
  });
});
