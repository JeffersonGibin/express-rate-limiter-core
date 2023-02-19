import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";

export interface IMiddleware {
  
  /**
   * Function that applies the execution of the rate limit logic, this function is in fact the initial function
   * @param {Request} req request param express
   * @param {Response} res response param express
   * @param {NextFunction} next next param express
   * @returns {void}
   */
  apply: (
    req: IExpressRequest,
    res: IExpressResponse,
    next: INextFunctionExpress
  ) => void;
}
