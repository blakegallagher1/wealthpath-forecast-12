
/**
 * Utilities for market cycles and investment returns
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

/**
 * Updates the market cycle state
 * @param currentCycle The current market cycle value
 * @returns Updated market cycle value
 */
export const updateMarketCycle = (currentCycle: number): number => {
  const cycleChangeChance = 0.15; // 15% chance of changing market regime each year
  
  if (Math.random() < cycleChangeChance) {
    // Generate a new market cycle between -1 (bear) and 1 (bull)
    return (Math.random() - 0.5) * 2;
  } else {
    // Mean reversion - gradually return toward neutral
    return currentCycle * 0.8;
  }
};

/**
 * Updates the real estate market cycle state
 * @param currentCycle The current real estate market cycle value
 * @param cycleLength Current cycle length
 * @returns Updated real estate market cycle and cycle length
 */
export const updateRealEstateCycle = (
  currentCycle: number, 
  cycleLength: number
): { cycle: number; length: number } => {
  const maxRealEstateCycleLength = 8; // Real estate cycles tend to be longer than stock market cycles
  
  if (cycleLength <= 0) {
    // Generate a new real estate market cycle
    const newCycle = (Math.random() - 0.5) * 2; // Between -1 and 1
    const newLength = Math.floor(Math.random() * maxRealEstateCycleLength) + 3; // Minimum 3 years
    return { cycle: newCycle, length: newLength };
  } else {
    // More gradual changes in real estate
    return { 
      cycle: currentCycle * 0.9, 
      length: cycleLength - 1 
    };
  }
};

/**
 * Calculates real estate return based on market cycles and volatility
 * @param baseAppreciationRate Base real estate appreciation rate
 * @param volatility Volatility factor
 * @param marketCycle Current market cycle value
 * @returns Calculated real estate return rate
 */
export const calculateRealEstateReturn = (
  baseAppreciationRate: number,
  volatility: number,
  marketCycle: number
): number => {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const cycleFactor = 1 + marketCycle * 0.3; // ±30% adjustment based on cycle
  
  // The real estate return should be more conservative and less volatile
  // We'll cap it between -5% and +15% after all adjustments
  const rawRealEstateReturn = (baseAppreciationRate + volatility * z) * cycleFactor;
  return Math.min(0.15, Math.max(-0.05, rawRealEstateReturn));
};
