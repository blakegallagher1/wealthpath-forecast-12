
import { calculateNetWorthProjection as calculateNetWorthProjectionImpl } from "./netWorthProjectionCalculator";
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
  return calculateNetWorthProjectionImpl(inputs, lifeEventImpact);
};
