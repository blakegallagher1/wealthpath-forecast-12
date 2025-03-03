
import { CalculatorInputs } from "./types";

/**
 * Calculates the estimated annual retirement income
 * @param adjustedRetirementSavings Total retirement savings adjusted for life events
 * @param inputs Calculator input values
 * @returns The estimated annual retirement income
 */
export const calculateRetirementIncome = (
  adjustedRetirementSavings: number,
  inputs: CalculatorInputs
): number => {
  // Calculate estimated annual retirement income
  // Using the 4% rule (or user-specified withdrawal rate)
  const withdrawalAmount = adjustedRetirementSavings * (inputs.retirementWithdrawalRate / 100);
  
  // Add social security and pension (if applicable)
  const annualSocialSecurity = inputs.socialSecurityBenefit * 12;
  const annualSpouseSocialSecurity = inputs.spouseSocialSecurityBenefit * 12;
  const annualPension = inputs.hasPension ? inputs.pensionAmount : 0;
  
  const totalAnnualRetirementIncome = withdrawalAmount + annualSocialSecurity + 
                                    annualSpouseSocialSecurity + annualPension;
  
  return totalAnnualRetirementIncome;
};
