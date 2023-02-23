import { ONE_SECOND_IN_MILLISECOND } from "../../constants";

/**
 *  Calculates time waitting
 * @param lastTimeRequestinMilliseconds
 * @param timeRetryInSeconds
 * @returns {number} time waiting in millisseconds
 */
export const timeWaitingCalculations = (
  lastTimeRequestinMilliseconds: number,
  timeRetryInSeconds: number
): number => {
  // TIME_RETRY_IN_SECONDS * 1000
  const timeRetryInMilliseconds =
    timeRetryInSeconds * ONE_SECOND_IN_MILLISECOND;

  // TIME WAITING = TIME_WAIT + TIMESTAMP_LAST_REQUEST
  const waitTime = lastTimeRequestinMilliseconds + timeRetryInMilliseconds;

  return waitTime;
};
