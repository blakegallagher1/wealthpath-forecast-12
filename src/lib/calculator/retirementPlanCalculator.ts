
import { calculateNetWorthProjection } from "./netWorthCalculator";
import { generateIncomeSourcesData } from "./incomeSourcesCalculator";
import { generateWithdrawalStrategyData } from "./withdrawalStrategyCalculator";
import { generateRiskProfileData } from "./riskProfileCalculator";
import { generateSocialSecurityData } from "./socialSecurityCalculator";
import { generateDebtPayoffData } from "./debtPayoffCalculator";
import { calculateLifeEventImpact } from "./lifeEventCalculator";
import { generateRecommendations } from "./recommendationGenerator";
import { calculateRetirementSavings } from "./savingsCalculator";
import { calculateRetirementIncome } from "./incomeCalculator";
import { calculateSustainability } from "./sustainabilityCalculator";
import { calculatePortfolioLongevity } from "./portfolioLongevityCalculator";
import { CalculatorInputs, RetirementPlan } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  // Calculate impact of life events on savings
  const lifeEventImpact = calculateLifeEventImpact(inputs);
  
  // Calculate current total assets
  const totalAssets = inputs.cashSavings + 
                      inputs.retirementAccounts + 
                      inputs.rothAccounts + 
                      inputs.taxableInvestments + 
                      inputs.realEstateEquity;
  
  // Calculate current total liabilities
  const totalLiabilities = inputs.mortgageBalance + 
                           inputs.studentLoanBalance + 
                           inputs.autoLoanBalance + 
                           inputs.creditCardBalance;
  
  // Calculate current net worth
  const currentNetWorth = totalAssets - totalLiabilities;
  
  // Calculate projected retirement savings
  const adjustedRetirementSavings = calculateRetirementSavings(inputs, lifeEventImpact);
  
  // Calculate estimated annual retirement income
  const totalAnnualRetirementIncome = calculateRetirementIncome(adjustedRetirementSavings, inputs);
  
  // Calculate sustainability metrics
  const { sustainabilityScore, successProbability, incomeReplacementRatio } = 
    calculateSustainability(totalAnnualRetirementIncome, inputs);
  
  // Calculate portfolio longevity
  const portfolioLongevity = calculatePortfolioLongevity(adjustedRetirementSavings, inputs);
  
  // Generate recommendations
  const recommendations = generateRecommendations(inputs, incomeReplacementRatio, portfolioLongevity);
  
  // Calculate data for charts
  const netWorthData = calculateNetWorthProjection(inputs, lifeEventImpact);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);
  const debtPayoffData = generateDebtPayoffData(inputs);
  
  return {
    totalRetirementSavings: adjustedRetirementSavings,
    estimatedAnnualRetirementIncome: totalAnnualRetirementIncome,
    sustainabilityScore,
    successProbability,
    portfolioLongevity,
    recommendations,
    netWorthData,
    incomeSourcesData,
    withdrawalStrategyData,
    riskProfileData,
    socialSecurityData,
    debtPayoffData,
  };
};
