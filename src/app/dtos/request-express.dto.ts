import {
  RequestExpress,
  ResponseExpress,
  NextFunctionExpress,
} from "../../interfaces/express";

export class RequestExpressDTO {
  public readonly request: RequestExpress;
  public readonly response: ResponseExpress;
  public readonly next: NextFunctionExpress;

  constructor(
    readonly req: RequestExpress,
    readonly res: ResponseExpress,
    next: NextFunctionExpress
  ) {
    this.request = req;
    this.response = res;
    this.next = next;
  }
}
