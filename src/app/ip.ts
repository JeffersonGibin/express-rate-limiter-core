import * as NativeNodeNet from "node:net";
import { RequestExpress } from "../core/interfaces/express";

export class Ip {
  private request: RequestExpress;

  constructor(req: RequestExpress) {
    this.request = req;
  }

  /**
   * Checks if the provided IP address is valid.
   * @returns boolean - True if the IP is valid, false otherwise.
   */
  public isIP(ip: string): boolean {
    if (ip === undefined || NativeNodeNet.isIP(ip) === 0) {
      return false;
    }

    return true;
  }

  /**
   * returns the appropriate IP address based on trust in the proxy and the X-Forwarded-For header.
   * @returns string - The determined IP address.
   */
  public getIp() {
    const trustProxy = this.request.app.get("trust proxy") ?? false;
    const xForwardedForHeader = (
      (this.request.headers["x-forwarded-for"] as string) ?? ""
    ).split(",")[0];

    if (!xForwardedForHeader && trustProxy) {
      return this.request.ip;
    } else if (xForwardedForHeader && !trustProxy) {
      return xForwardedForHeader;
    } else {
      return this.request.ip;
    }
  }
}
