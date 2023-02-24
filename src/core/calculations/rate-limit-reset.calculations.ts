import { ONE_SECOND_IN_MILLISECOND, SIXTY_SECONDS } from "../constants/time";

/**
 * Calculates the time that client goes reset rate-limit
 * @param parameters
 * @returns {number} time in milliseconds
 */
export const rateLimitResetCalculations = (parameters: {
  periodWindow: number;
  lastTimeRequestInMilliseconds: number;
  periodWindowIn: "SECONDS" | "MINUTES";
}): number => {
  const { periodWindow, lastTimeRequestInMilliseconds, periodWindowIn } =
    parameters;

  if (periodWindowIn === "SECONDS") {
    return Math.ceil(
      lastTimeRequestInMilliseconds + periodWindow * ONE_SECOND_IN_MILLISECOND
    );
  }

  // minutes
  return Math.ceil(
    lastTimeRequestInMilliseconds +
      periodWindow * SIXTY_SECONDS * ONE_SECOND_IN_MILLISECOND
  );
};
