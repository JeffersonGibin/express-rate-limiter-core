// import {
//   NextFunction as INextFunctionExpress,
//   Request as IExpressRequest,
//   Response as IExpressResponse,
// } from "express";
// import { RateLimit } from "./application/rate-limit";
// import { RequestInterceptor } from "./application/request-interceptor";
// import { ICache } from "./interfaces/cache";
// import { middleware } from "./middleware";

// jest.mock("./application/request-interceptor");
// jest.mock("./application/rate-limit");

// const req = {} as IExpressRequest;
// const res = { send: jest.fn() } as unknown as IExpressResponse;
// const nextFn = jest.fn<INextFunctionExpress, []>();

// describe("middleware unit test", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });

//   test("should call apply function correctly", () => {
//     const constructorRateLimit = jest.fn();
//     (RateLimit as jest.Mock).mockImplementation(constructorRateLimit);

//     const constructorRequestInterceptor = jest.fn();
//     (RequestInterceptor as jest.Mock).mockImplementation(
//       constructorRequestInterceptor
//     );

//     const spyApply = jest.spyOn(RequestInterceptor.prototype, "execute");

//     const mw = middleware({
//       cache: {} as ICache,
//       maxRequest: 10,
//       rateLimitWindow: 10,
//     });

//     mw.apply(req, res, nextFn);

//     expect(constructorRateLimit).toBeCalled();
//     expect(constructorRequestInterceptor).toBeCalled();
//     expect(spyApply).toBeCalled();
//   });
// });
