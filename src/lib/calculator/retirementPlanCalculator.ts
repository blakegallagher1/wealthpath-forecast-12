
import { calculateNetWorthProjection } from "./netWorthCalculator";
import { generateIncomeSourcesData } from "./incomeSourcesCalculator";
import { generateWithdrawalStrategyData } from "./withdrawalStrategyCalculator";
import { generateRiskProfileData } from "./riskProfileCalculator";
import { generateSocialSecurityData } from "./socialSecurityCalculator";
import { CalculatorInputs, RetirementPlan } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    cashSavings,
    retirementAccounts,
    rothAccounts,
    taxableInvestments,
    realEstateEquity,
    mortgageBalance,
    studentLoanBalance,
    autoLoanBalance,
    creditCardBalance,
    annual401kContribution,
    annualRothContribution,
    annualTaxableContribution,
    investmentReturnRate,
    retirementWithdrawalRate,
    socialSecurityBenefit,
    spouseSocialSecurityBenefit,
    retirementAnnualSpending,
    hasPension,
    pensionAmount,
    inflationRate,
  } = inputs;

  // Calculate remaining years until retirement
  const yearsUntilRetirement = retirementAge - currentAge;
  
  // Calculate current total assets
  const totalAssets = cashSavings + 
                      retirementAccounts + 
                      rothAccounts + 
                      taxableInvestments + 
                      realEstateEquity;
  
  // Calculate current total liabilities
  const totalLiabilities = mortgageBalance + 
                          studentLoanBalance + 
                          autoLoanBalance + 
                          creditCardBalance;
  
  // Calculate current net worth
  const currentNetWorth = totalAssets - totalLiabilities;
  
  // Calculate total annual contributions to retirement accounts
  const annualRetirementContributions = annual401kContribution + 
                                        annualRothContribution + 
                                        annualTaxableContribution;

  // Calculate life event impact for projections
  const lifeEventImpact = calculateLifeEventImpact(inputs);
  
  // Calculate projected retirement savings at retirement age
  // Apply compound interest formula: P(1+r)^t + PMT[((1+r)^t - 1)/r]
  // Where P = principal, r = rate, t = time, PMT = periodic payment
  const retirementSavings = (retirementAccounts + rothAccounts + taxableInvestments) * 
                          Math.pow(1 + investmentReturnRate / 100, yearsUntilRetirement) + 
                          (annualRetirementContributions * 
                          (Math.pow(1 + investmentReturnRate / 100, yearsUntilRetirement) - 1) / 
                          (investmentReturnRate / 100));
  
  // Subtract life event costs from final retirement savings
  const adjustedRetirementSavings = retirementSavings - lifeEventImpact;
  
  // Calculate estimated annual retirement income
  // Using the 4% rule (or user-specified withdrawal rate)
  const withdrawalAmount = adjustedRetirementSavings * (retirementWithdrawalRate / 100);
  
  // Add social security and pension (if applicable)
  const annualSocialSecurity = socialSecurityBenefit * 12;
  const annualSpouseSocialSecurity = spouseSocialSecurityBenefit * 12;
  const annualPension = hasPension ? pensionAmount : 0;
  
  const totalAnnualRetirementIncome = withdrawalAmount + annualSocialSecurity + annualSpouseSocialSecurity + annualPension;
  
  // Calculate sustainability score (0-100)
  // Based on income replacement ratio, portfolio longevity, and diversification
  const incomeReplacementRatio = totalAnnualRetirementIncome / retirementAnnualSpending;
  const sustainabilityScore = Math.min(100, Math.max(0, Math.round(incomeReplacementRatio * 50) + 
                                                      (retirementWithdrawalRate <= 4 ? 30 : 
                                                      retirementWithdrawalRate <= 5 ? 20 : 10) + 
                                                      (investmentReturnRate >= 5 ? 20 : 10)));
  
  // Calculate success probability
  // This is simplified, in reality would use Monte Carlo simulations
  const successProbability = Math.min(99, Math.max(1, Math.round(sustainabilityScore * 0.95)));
  
  // Calculate portfolio longevity
  const retirementYears = lifeExpectancy - retirementAge;
  const inflationAdjustedReturn = investmentReturnRate - inflationRate;
  
  let portfolioLongevity = retirementAge;
  let remainingBalance = adjustedRetirementSavings;
  
  for (let i = 0; i < 50; i++) { // Max 50 years after retirement
    if (remainingBalance <= 0) break;
    
    remainingBalance = remainingBalance * (1 + inflationAdjustedReturn / 100) - 
                      retirementAnnualSpending * Math.pow(1 + inflationRate / 100, i);
    
    if (remainingBalance > 0) {
      portfolioLongevity++;
    }
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (retirementWithdrawalRate > 4) {
    recommendations.push("Consider reducing your withdrawal rate to improve sustainability.");
  }
  
  if (incomeReplacementRatio < 0.7) {
    recommendations.push("Your estimated retirement income may be insufficient. Consider increasing savings or delaying retirement.");
  }
  
  if (annual401kContribution < 19500 && inputs.annualIncome > 100000) {
    recommendations.push("Maximize your 401(k) contributions to take advantage of tax benefits.");
  }
  
  if (inputs.creditCardBalance > 0) {
    recommendations.push("Pay off high-interest credit card debt before focusing on investments.");
  }
  
  if (portfolioLongevity < lifeExpectancy) {
    recommendations.push(`Your savings may run out at age ${portfolioLongevity}. Consider adjusting your retirement strategy.`);
  }

  // Generate chart data
  const netWorthData = calculateNetWorthProjection(inputs, lifeEventImpact);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);

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
  };
};

// Helper function to calculate the impact of life events on savings
const calculateLifeEventImpact = (inputs: CalculatorInputs): number => {
  let totalImpact = 0;
  const currentYear = new Date().getFullYear();
  
  // Wedding costs
  if (inputs.planningWedding) {
    const yearsToWedding = Math.max(0, inputs.weddingYear - currentYear);
    // Calculate present value of future wedding costs
    if (yearsToWedding === 0) {
      // If wedding is this year, full impact
      totalImpact += inputs.weddingCost;
    } else {
      // Calculate how much would need to be saved from now until wedding
      // Assuming the amount grows with investment return rate
      const monthlyContribution = inputs.weddingCost / (yearsToWedding * 12);
      // This is simplified - in reality would need to calculate growing annuity
      totalImpact += monthlyContribution * 12 * yearsToWedding; // Annual impact on savings over time
    }
  }
  
  // Children costs
  if (inputs.planningChildren) {
    // Assuming children costs start 1 year from now and continue for 18 years per child
    const totalChildrenCost = inputs.numberOfChildren * inputs.childCostPerYear * 18;
    // Simplified: estimate how much this reduces retirement savings
    // Assuming about 15% of child costs would have gone to retirement otherwise
    totalImpact += totalChildrenCost * 0.15;
  }
  
  // Home purchase
  if (inputs.planningHomePurchase) {
    const yearsToHomePurchase = Math.max(0, inputs.homePurchaseYear - currentYear);
    if (yearsToHomePurchase === 0) {
      // If home purchase is this year, full down payment impact
      totalImpact += inputs.homeDownPayment;
    } else {
      // Calculate how much would need to be saved annually for down payment
      const annualSavingsForDownPayment = inputs.homeDownPayment / yearsToHomePurchase;
      totalImpact += annualSavingsForDownPayment * yearsToHomePurchase; // Total impact on other savings
    }
  }
  
  return totalImpact;
};
