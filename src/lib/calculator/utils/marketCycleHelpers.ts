
/**
 * Utilities for managing market cycles
 */

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
