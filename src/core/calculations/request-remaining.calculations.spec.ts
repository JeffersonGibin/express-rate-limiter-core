import { requestRemainingCalculations } from "./request-remaining.calculations";

describe("request-remaining.calculations unit test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("it's should calculates amount request remaining", () => {
    const numberMaxRequets = 10;
    const hitsRegistredInCache = 5;

    const result = requestRemainingCalculations(
      numberMaxRequets,
      hitsRegistredInCache
    );

    expect(result).toBe(5);
  });

  test("it's should calculate the amount request remaining and return zero when the result is negative", () => {
    const numberMaxRequets = 5;
    const hitsRegistredInCache = 10;

    const result = requestRemainingCalculations(
      numberMaxRequets,
      hitsRegistredInCache
    );

    expect(result).toBe(0);
  });
});
