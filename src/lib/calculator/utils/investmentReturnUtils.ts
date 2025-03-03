
/**
 * Utilities for generating investment returns
 */

/**
 * Generates a random market return with volatility based on a normal distribution
 * @param baseReturn Base expected return
 * @param volatility Standard deviation of returns (volatility)
 * @returns A random return rate
 */
export const generateMarketReturn = (baseReturn: number, volatility: number): number => {
  // Normal distribution approximation using Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  
  // Apply volatility and add to base return
  const randomReturn = baseReturn + volatility * z;
  
  // Apply a floor to prevent extreme negative returns
  return Math.max(randomReturn, -0.25); // Maximum 25% loss in any year
};
