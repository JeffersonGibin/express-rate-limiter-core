import { timeWaitingCalculations } from "./time-waiting.calculations";

// 2023-02-23T13:20:00.000Z
const MOCK_LAST_TIME_REQUEST = 1677158400000;

describe("time-waiting.calculations unit test", () => {
  test("it's should calculate time waiting correctly", () => {
    const lastTimeRequestinMilliseconds = MOCK_LAST_TIME_REQUEST;
    const timeRetryInSeconds = 60;

    const result = timeWaitingCalculations(
      lastTimeRequestinMilliseconds,
      timeRetryInSeconds
    );

    // 2023-02-23T13:21:00.000Z
    const expectedResult = 1677158460000;

    expect(result).toBe(expectedResult);
  });

  test("it's should to return last time request when time retry is equal zero", () => {
    const lastTimeRequestinMilliseconds = MOCK_LAST_TIME_REQUEST;
    const timeRetryInSeconds = 0;

    const result = timeWaitingCalculations(
      lastTimeRequestinMilliseconds,
      timeRetryInSeconds
    );

    // 2023-02-23T13:20:00.000Z
    const expectedResult = MOCK_LAST_TIME_REQUEST;

    expect(result).toBe(expectedResult);
  });
});
