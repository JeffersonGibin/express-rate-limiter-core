import { rateLimitResetCalculations } from "./rate-limit-reset.calculations";

// 2023-02-23T13:20:00.000Z
const MOCK_LAST_TIME_REQUEST = 1677158400000;

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

    // 2023-02-23T13:20:10.000Z variation the 10 seconds
    const expectedResult = 1677158410000;
    expect(result).toBe(expectedResult);
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

    // 2023-02-23T13:10:00.000Z variation the 10 minutes
    const expectedResult = 1677159000000;

    expect(result).toBe(expectedResult);
  });
});
