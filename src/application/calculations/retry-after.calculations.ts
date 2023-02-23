import { ONE_SECOND_IN_MILLISECOND } from "../../constants";

/**
 * Calculates value retry after
 * @param timeResetLimit
 * @returns {number} retry after in seconds
 */
export const retryAfterCalculations = (timeResetLimit: number): number => {
  const now = Date.now();
  const diff = timeResetLimit - now;
  return Math.ceil(diff / ONE_SECOND_IN_MILLISECOND);
};
