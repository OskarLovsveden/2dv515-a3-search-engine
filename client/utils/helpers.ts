/**
 * Truncates a number to a given number of decimal places.
 *
 * @param number A number to truncate.
 * @param decimals The number of decimal places.
 * @returns
 */
export const truncate = (number: number, decimals: number): number => {
  return Number.parseFloat(number.toFixed(decimals));
};
