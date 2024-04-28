import { RequestExpress } from "../core/interfaces/express";
import { Ip } from "./ip";

describe("Ip class unit test", () => {
  describe("isIP method", () => {
    it("should return false if IP is empty", () => {
      const mockReq = {
        app: jest.fn(),
        headers: {},
        ip: undefined,
      } as unknown as RequestExpress;

      const ip = new Ip(mockReq);
      expect(ip.isIP("")).toBe(false);
    });

    it("should return false if IP is invalid", () => {
      const mockReq = {
        app: jest.fn(),
        headers: {},
        ip: "123.456.789.000",
      } as unknown as RequestExpress;

      const ip = new Ip(mockReq);
      expect(ip.isIP("123.456.789.000")).toBe(false);
    });

    it("should return true if IP is valid", () => {
      const mockReq = {
        app: jest.fn(),
        headers: {},
        ip: "192.168.1.1",
      } as unknown as RequestExpress;
      const ip = new Ip(mockReq);
      expect(ip.isIP("192.168.1.1")).toBe(true);
    });
  });

  describe("getIp method", () => {
    it("should return request IP if no X-Forwarded-For header and not trusting proxy", () => {
      const mockReq = {
        app: { get: jest.fn().mockReturnValue(false) },
        headers: {},
        ip: "192.168.1.1",
      } as unknown as RequestExpress;

      const ip = new Ip(mockReq);
      expect(ip.getIp()).toBe("192.168.1.1");
    });

    it("should return X-Forwarded-For IP if header exists and trusting proxy", () => {
      const mockReq = {
        app: { get: jest.fn().mockReturnValue(true) },
        headers: { "x-forwarded-for": "10.0.0.1, 10.0.0.2" },
        ip: "192.168.1.1",
      } as unknown as RequestExpress;

      const ip = new Ip(mockReq);
      expect(ip.getIp()).toBe("192.168.1.1");
    });

    it("should return request IP if X-Forwarded-For header exists but not trusting proxy", () => {
      const mockReq = {
        app: { get: jest.fn().mockReturnValue(false) },
        headers: { "x-forwarded-for": "10.0.0.1, 10.0.0.2" },
        ip: "192.168.1.1",
      } as unknown as RequestExpress;

      const ip = new Ip(mockReq);
      expect(ip.getIp()).toBe("10.0.0.1");
    });
  });
});
