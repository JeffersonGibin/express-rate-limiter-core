import {
  NextFunction as INextFunctionExpress,
  Request as IExpressRequest,
  Response as IExpressResponse,
} from "express";

export class RequestExpressDTO {
  public readonly request: IExpressRequest;
  public readonly response: IExpressResponse;
  public readonly next: INextFunctionExpress;

  constructor(
    readonly req: IExpressRequest,
    readonly res: IExpressResponse,
    next: INextFunctionExpress
  ) {
    this.request = req;
    this.response = res;
    this.next = next;
  }
}
