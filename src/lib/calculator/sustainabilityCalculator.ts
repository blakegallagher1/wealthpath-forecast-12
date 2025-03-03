
import { CalculatorInputs } from "./types";

/**
 * Calculates the sustainability score and success probability of the retirement plan
 * @param totalAnnualRetirementIncome Estimated annual retirement income
 * @param inputs Calculator input values
 * @returns Object containing sustainability score and success probability
 */
export const calculateSustainability = (
  totalAnnualRetirementIncome: number,
  inputs: CalculatorInputs
): { sustainabilityScore: number; successProbability: number; incomeReplacementRatio: number } => {
  // Calculate income replacement ratio
  const incomeReplacementRatio = totalAnnualRetirementIncome / inputs.retirementAnnualSpending;
  
  // Calculate sustainability score (0-100)
  // Based on income replacement ratio, portfolio longevity, and diversification
  const sustainabilityScore = Math.min(100, Math.max(0, Math.round(incomeReplacementRatio * 50) + 
                                                 (inputs.retirementWithdrawalRate <= 4 ? 30 : 
                                                  inputs.retirementWithdrawalRate <= 5 ? 20 : 10) + 
                                                 (inputs.investmentReturnRate >= 5 ? 20 : 10)));
  
  // Calculate success probability
  // This is simplified, in reality would use Monte Carlo simulations
  const successProbability = Math.min(99, Math.max(1, Math.round(sustainabilityScore * 0.95)));
  
  return {
    sustainabilityScore,
    successProbability,
    incomeReplacementRatio
  };
};
