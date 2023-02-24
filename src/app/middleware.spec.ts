import { Application } from "./application";

import { middleware } from "./middleware";

import { ArgumentsPolicyDTO } from "./dtos/arguments-policy.dto";
import { RequestExpressDTO } from "./dtos/request-express.dto";
import { MemoryCacheRepository } from "../shared/repositories/memory-cache.repository";
import { ICache } from "../shared/interfaces/cache";
import {
  RequestExpress,
  ResponseExpress,
  NextFunctionExpress,
} from "../core/interfaces/express";

jest.mock("./application");
jest.mock("./dtos/arguments-policy.dto");
jest.mock("./dtos/request-express.dto");

const req = {} as RequestExpress;
const res = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
} as unknown as ResponseExpress;
const nextFn = jest.fn<NextFunctionExpress, []>();

const requestExpressDtoFn = jest.fn();
const argumentsPolicyftoFn = jest.fn();
const constructorApplication = jest.fn();

describe("middleware unit test", () => {
  beforeEach(() => {
    (Application as jest.Mock).mockImplementation(constructorApplication);
    (RequestExpressDTO as jest.Mock).mockImplementation(requestExpressDtoFn);
    (ArgumentsPolicyDTO as jest.Mock).mockImplementation(argumentsPolicyftoFn);
  });

  test("it's should call apply function correctly with memory cache", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");
    const spyGetInstance = jest.spyOn(MemoryCacheRepository, "getInstance");

    const mw = middleware({
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
    });

    mw.apply(req, res, nextFn);

    expect(constructorApplication).toBeCalled();
    expect(argumentsPolicyftoFn).toBeCalled();
    expect(requestExpressDtoFn).toBeCalled();
    expect(spyGetInstance).toBeCalled();
    expect(spyApply).toBeCalled();

    spyApply.mockRestore();
    spyGetInstance.mockRestore();
  });

  test("it's should call apply function correctly when receive custom cache", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");

    const mw = middleware({
      cache: {} as ICache,
      policy: {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
    });

    mw.apply(req, res, nextFn);

    expect(constructorApplication).toBeCalled();
    expect(argumentsPolicyftoFn).toBeCalled();
    expect(requestExpressDtoFn).toBeCalled();
    expect(spyApply).toBeCalled();

    spyApply.mockRestore();
  });

  test("it's should call apply function correctly when receive blockRequestRule", () => {
    const spyApply = jest.spyOn(Application.prototype, "execute");

    const mw = middleware({
      cache: {} as ICache,
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

    expect(constructorApplication).toBeCalled();
    expect(argumentsPolicyftoFn).toBeCalled();
    expect(requestExpressDtoFn).toBeCalled();
    expect(spyApply).toBeCalled();

    spyApply.mockRestore();
  });

  test("it's should catch and handle errors", () => {
    const executeSpy = jest
      .spyOn(Application.prototype, "execute")
      .mockImplementation(() => {
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
