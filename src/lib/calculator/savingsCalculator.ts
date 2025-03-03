
import { CalculatorInputs } from "./types";

/**
 * Calculates the projected retirement savings at retirement age
 * @param inputs Calculator input values
 * @param lifeEventImpact Impact of life events on savings
 * @returns Projected retirement savings
 */
export const calculateRetirementSavings = (
  inputs: CalculatorInputs,
  lifeEventImpact: number
): number => {
  // Calculate remaining years until retirement
  const yearsUntilRetirement = inputs.retirementAge - inputs.currentAge;
  
  // Calculate total annual contributions to retirement accounts
  const annualRetirementContributions = inputs.annual401kContribution + 
                                      inputs.annualRothContribution + 
                                      inputs.annualTaxableContribution;
  
  // Calculate projected retirement savings at retirement age
  // Apply compound interest formula: P(1+r)^t + PMT[((1+r)^t - 1)/r]
  // Where P = principal, r = rate, t = time, PMT = periodic payment
  const retirementSavings = (inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments) * 
                           Math.pow(1 + inputs.investmentReturnRate / 100, yearsUntilRetirement) + 
                           (annualRetirementContributions * 
                           (Math.pow(1 + inputs.investmentReturnRate / 100, yearsUntilRetirement) - 1) / 
                           (inputs.investmentReturnRate / 100));
  
  // Subtract life event costs from final retirement savings
  const adjustedRetirementSavings = retirementSavings - lifeEventImpact;
  
  return adjustedRetirementSavings;
};
