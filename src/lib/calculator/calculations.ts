
import { calculateNetWorthProjection } from "./netWorthCalculator";
import { generateIncomeSourcesData } from "./incomeSourcesCalculator";
import { generateWithdrawalStrategyData } from "./withdrawalStrategyCalculator";
import { generateRiskProfileData } from "./riskProfileCalculator";
import { generateSocialSecurityData } from "./socialSecurityCalculator";
import { generateDebtPayoffData } from "./debtPayoffCalculator";
import { calculateLifeEventImpact } from "./lifeEventCalculator";
import { generateRecommendations } from "./recommendationGenerator";
import { CalculatorInputs, RetirementPlan } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  // Calculate impact of life events on savings
  const lifeEventImpact = calculateLifeEventImpact(inputs);
  
  // Calculate remaining years until retirement
  const yearsUntilRetirement = inputs.retirementAge - inputs.currentAge;
  
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
  
  // Calculate estimated annual retirement income
  // Using the 4% rule (or user-specified withdrawal rate)
  const withdrawalAmount = adjustedRetirementSavings * (inputs.retirementWithdrawalRate / 100);
  
  // Add social security and pension (if applicable)
  const annualSocialSecurity = inputs.socialSecurityBenefit * 12;
  const annualSpouseSocialSecurity = inputs.spouseSocialSecurityBenefit * 12;
  const annualPension = inputs.hasPension ? inputs.pensionAmount : 0;
  
  const totalAnnualRetirementIncome = withdrawalAmount + annualSocialSecurity + annualSpouseSocialSecurity + annualPension;
  
  // Calculate sustainability score (0-100)
  // Based on income replacement ratio, portfolio longevity, and diversification
  const incomeReplacementRatio = totalAnnualRetirementIncome / inputs.retirementAnnualSpending;
  const sustainabilityScore = Math.min(100, Math.max(0, Math.round(incomeReplacementRatio * 50) + 
                                                     (inputs.retirementWithdrawalRate <= 4 ? 30 : 
                                                      inputs.retirementWithdrawalRate <= 5 ? 20 : 10) + 
                                                     (inputs.investmentReturnRate >= 5 ? 20 : 10)));
  
  // Calculate success probability
  // This is simplified, in reality would use Monte Carlo simulations
  const successProbability = Math.min(99, Math.max(1, Math.round(sustainabilityScore * 0.95)));
  
  // Calculate portfolio longevity
  // Simplified: how long would money last at specified withdrawal rate
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
