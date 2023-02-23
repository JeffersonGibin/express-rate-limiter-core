/**
 *  Calculates difference between number max requests and total hits cache
 * @param numberMaxRequets
 * @param hitsRegistredInCache
 * @returns {number} integer represent request remaining
 */
export const requestRemainingCalculations = (
  numberMaxRequets: number,
  hitsRegistredInCache: number
): number => {
  const ZERO = 0;
  const diffHitsRemaning = numberMaxRequets - hitsRegistredInCache;

  if (diffHitsRemaning < ZERO) {
    return ZERO;
  }

  return diffHitsRemaning;
};
