
import { calculateNetWorthProjection as calculateNetWorthProjectionImpl } from "./projections/netWorthProjection";
import { CalculatorInputs, NetWorthDataPoint } from "./types";

/**
 * Calculates the net worth projection over time based on user inputs
 * This is the main entry point that leverages the modular calculation components
 * @param inputs Calculator input values
 * @param lifeEventImpact Overall impact from life events
 * @returns Array of net worth data points for each projection year
 */
export const calculateNetWorthProjection = (
  inputs: CalculatorInputs, 
  lifeEventImpact: number
): NetWorthDataPoint[] => {
  if (!inputs) {
    throw new Error("Calculator inputs are required");
  }
  
  if (isNaN(lifeEventImpact)) {
    // Default to zero if impact is not a number
    lifeEventImpact = 0;
  }
  
  try {
    return calculateNetWorthProjectionImpl(inputs, lifeEventImpact);
  } catch (error) {
    console.error("Error calculating net worth projection:", error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};
