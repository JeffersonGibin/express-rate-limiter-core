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
  const diffHitsRemaning = numberMaxRequets - hitsRegistredInCache;

  return diffHitsRemaning;
};
