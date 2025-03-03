
import { CalculatorInputs } from "./types";
import { processLifeEvents } from "./projections/lifeEventProjection";

/**
 * Calculates the financial impact of life events for a specific year
 * This is a wrapper for the more detailed processLifeEvents function
 * @param inputs Calculator input values
 * @param projectedYear The year being projected
 * @param homeValue Current home value
 * @param mortgageBalance Current mortgage balance
 * @param realEstateEquity Current real estate equity
 * @returns Object containing the financial impacts of life events
 */
export const calculateLifeEventsImpact = (
  inputs: CalculatorInputs,
  projectedYear: number,
  homeValue: number,
  mortgageBalance: number,
  realEstateEquity: number
): { 
  yearlyLifeEventCosts: number; 
  homeValueAdjustment: number;
  newMortgageBalance: number;
  newEquity: number;
} => {
  return processLifeEvents(
    inputs,
    projectedYear,
    homeValue,
    mortgageBalance,
    realEstateEquity
  );
};
