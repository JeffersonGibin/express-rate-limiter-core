import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";

export type ResponseExpress = IExpressResponse;
export type RequestExpress = IExpressRequest;
export type NextFunctionExpress = INextFunctionExpress;
