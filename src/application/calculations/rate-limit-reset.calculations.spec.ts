import { rateLimitResetCalculations } from "./rate-limit-reset.calculations";

const MOCK_LAST_TIME_REQUEST = 1677158416250;

describe("rate-limit-reset unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("it's should calculate rate-limit reset when receive period window in seconds", () => {
    jest
      .spyOn(Date.prototype, "getTime")
      .mockReturnValue(MOCK_LAST_TIME_REQUEST);

    const lastTimeRequest = new Date().getTime();
    const result = rateLimitResetCalculations({
      lastTimeRequestInMilliseconds: lastTimeRequest,
      periodWindow: 10,
      periodWindowIn: "SECONDS",
    });

    /**
     * 10: ten seconds
     * 1000: one second in milliseconds
     */
    const expected = MOCK_LAST_TIME_REQUEST + 10 * 1000;

    expect(result).toBe(expected);
  });

  test("it's should calculate rate-limit reset when receive period window in minutes", () => {
    jest
      .spyOn(Date.prototype, "getTime")
      .mockReturnValue(MOCK_LAST_TIME_REQUEST);

    const lastTimeRequest = new Date().getTime();
    const result = rateLimitResetCalculations({
      lastTimeRequestInMilliseconds: lastTimeRequest,
      periodWindow: 10,
      periodWindowIn: "MINUTES",
    });

    /**
     * 10: ten minutes
     * 60: one minute in seconds
     * 1000: one second in milliseconds
     */
    const expected = MOCK_LAST_TIME_REQUEST + 10 * 60 * 1000;

    expect(result).toBe(expected);
  });
});
