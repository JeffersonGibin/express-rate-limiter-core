/* eslint-disable no-unused-vars */
import {
  RequestExpress,
  ResponseExpress,
  NextFunctionExpress,
} from "../interfaces/express";

export interface IMiddleware {
  /**
   * Function that applies the execution of the rate-limit logic, this function is in fact the initial function
   * @param {RequestExpress} req request param express
   * @param {ResponseExpress} res response param express
   * @param {NextFunctionExpress} next next param express
   * @returns {void}
   */
  apply: (
    req: RequestExpress,
    res: ResponseExpress,
    next: NextFunctionExpress
  ) => void;
}
