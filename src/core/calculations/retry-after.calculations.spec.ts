import { retryAfterCalculations } from "./retry-after.calculations";

// 2023-02-23T13:20:00.000Z
const MOCK_LAST_TIME_REQUEST = 1677158400000;

describe("retry-after.calculations unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("it's should calculate 'retry after' when variation is in seconds", () => {
    jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST);

    // 2023-02-23T13:20:10.000Z
    const TIME_RESET_LIMIT = 1677158410000;
    const result = retryAfterCalculations(TIME_RESET_LIMIT);

    expect(result).toBe(10);
  });

  test("it's should calculate 'retry after' when variation is in minutes and return seconds", () => {
    jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST);

    // 2023-02-23T13:30:00.000Z variation the 10 minutes
    const TIME_RESET_LIMIT = 1677159000000;
    const result = retryAfterCalculations(TIME_RESET_LIMIT);

    expect(result).toBe(600);
  });

  test("it's should calculate 'retry after' when variation is in hours and return seconds", () => {
    jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST);

    // 2023-02-23T14:20:00.000Z variation the 1 hour
    const TIME_RESET_LIMIT = 1677162000000;
    const result = retryAfterCalculations(TIME_RESET_LIMIT);

    expect(result).toBe(3600);
  });

  test("it's should calculate 'retry after' when variation is in days and return seconds", () => {
    jest.spyOn(Date, "now").mockReturnValue(MOCK_LAST_TIME_REQUEST);

    // 2023-02-24T13:20:00.000Z variation the 1 day
    const TIME_RESET_LIMIT = 1677244800000;
    const result = retryAfterCalculations(TIME_RESET_LIMIT);

    expect(result).toBe(86400);
  });
});
