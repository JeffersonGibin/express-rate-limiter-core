import { ICache } from "../../shared/interfaces/cache";
import { PoliciesFactory } from "./policies.factory";
import { RateLimitPerMinutesPolicy } from "./rate-limit-per-minutes.policy";
import { RateLimitPerPeriodPolicy } from "./rate-limit-per-period.policy";
import { RateLimitPerSecondsPolicy } from "./rate-limit-per-seconds.policy";

jest.mock("./rate-limit-per-seconds.policy");
jest.mock("./rate-limit-per-seconds.policy");
jest.mock("./rate-limit-per-minutes.policy");

describe("policies.factory unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("it's should create instance class of RateLimitPerSecondsPolicy", () => {
    const factoryInstance = new PoliciesFactory(
      {
        type: "REQUEST_PER_SECONDS",
        maxRequests: 10,
        periodWindow: 10,
      },
      {
        hits: 10,
        created_at: Date.now(),
        last_time_request: Date.now(),
      },
      {} as ICache
    );

    const resultInstance = factoryInstance.create();

    expect(resultInstance).toBeInstanceOf(RateLimitPerSecondsPolicy);
  });

  test("it's should create instance class of RateLimitPerMinutesPolicy", () => {
    const factoryInstance = new PoliciesFactory(
      {
        type: "REQUEST_PER_MINUTES",
        maxRequests: 10,
        periodWindow: 10,
      },
      {
        hits: 10,
        created_at: Date.now(),
        last_time_request: Date.now(),
      },
      {} as ICache
    );

    const resultInstance = factoryInstance.create();

    expect(resultInstance).toBeInstanceOf(RateLimitPerMinutesPolicy);
  });

  test("it's should create instance class of RateLimitPerPeriodPolicy", () => {
    const factoryInstance = new PoliciesFactory(
      {
        type: "REQUEST_PER_PERIOD",
        maxRequests: 10,
        periodWindowStart: new Date(),
        periodWindowEnd: new Date(),
      },
      {
        hits: 10,
        created_at: Date.now(),
        last_time_request: Date.now(),
      },
      {} as ICache
    );

    const resultInstance = factoryInstance.create();

    expect(resultInstance).toBeInstanceOf(RateLimitPerPeriodPolicy);
  });
});
