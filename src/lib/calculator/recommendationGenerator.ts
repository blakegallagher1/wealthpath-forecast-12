
import { CalculatorInputs } from "./types";

export const generateRecommendations = (
  inputs: CalculatorInputs, 
  incomeReplacementRatio: number, 
  portfolioLongevity: number
): string[] => {
  const recommendations: string[] = [];
  
  if (inputs.retirementWithdrawalRate > 4) {
    recommendations.push("Consider reducing your withdrawal rate to improve sustainability.");
  }
  
  if (incomeReplacementRatio < 0.7) {
    recommendations.push("Your estimated retirement income may be insufficient. Consider increasing savings or delaying retirement.");
  }
  
  if (inputs.annual401kContribution < 19500 && inputs.annualIncome > 100000) {
    recommendations.push("Maximize your 401(k) contributions to take advantage of tax benefits.");
  }
  
  if (inputs.creditCardBalance > 0) {
    recommendations.push("Pay off high-interest credit card debt before focusing on investments.");
  }
  
  if (portfolioLongevity < inputs.lifeExpectancy) {
    recommendations.push(`Your savings may run out at age ${portfolioLongevity}. Consider adjusting your retirement strategy.`);
  }
  
  return recommendations;
};
