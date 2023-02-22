import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";

/**
 * Abstraction of Reponse Express
 */
export type ResponseExpress = IExpressResponse;

/**
 * Abstraction of Request Express
 */
export type RequestExpress = IExpressRequest;

/**
 * Abstraction of NextFunction Express
 */
export type NextFunctionExpress = INextFunctionExpress;
