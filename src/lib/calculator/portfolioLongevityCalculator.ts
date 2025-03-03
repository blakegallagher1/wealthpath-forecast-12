
import { CalculatorInputs } from "./types";

/**
 * Calculates how long the retirement portfolio is expected to last
 * @param adjustedRetirementSavings Total retirement savings adjusted for life events
 * @param inputs Calculator input values
 * @returns The age at which the portfolio is expected to be depleted
 */
export const calculatePortfolioLongevity = (
  adjustedRetirementSavings: number,
  inputs: CalculatorInputs
): number => {
  const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
  const inflationAdjustedReturn = inputs.investmentReturnRate - inputs.inflationRate;
  
  let portfolioLongevity = inputs.retirementAge;
  let remainingBalance = adjustedRetirementSavings;
  
  for (let i = 0; i < 50; i++) { // Max 50 years after retirement
    if (remainingBalance <= 0) break;
    
    remainingBalance = remainingBalance * (1 + inflationAdjustedReturn / 100) - 
                      inputs.retirementAnnualSpending * Math.pow(1 + inputs.inflationRate / 100, i);
    
    if (remainingBalance > 0) {
      portfolioLongevity++;
    }
  }
  
  return portfolioLongevity;
};
