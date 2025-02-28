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
    lifeExpectancy = 90,
    annualIncome,
    incomeGrowthRate = 0.03,
    cashSavings = 0,
    retirementAccounts = 0,
    rothAccounts = 0,
    taxableInvestments = 0,
    realEstateEquity = 0,
    annual401kContribution = 0,
    annualRothContribution = 0,
    annualTaxableContribution = 0,
    investmentReturnRate = 0.07,
    mortgageBalance = 0
  } = inputs;

  // Basic calculations
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
  
  // Current total savings
  const currentTotalSavings = cashSavings + retirementAccounts + rothAccounts + taxableInvestments;
  
  // Annual total contributions
  const annualContributions = annual401kContribution + annualRothContribution + annualTaxableContribution;

  // Calculate future value with a more realistic approach
  let projectedSavings = currentTotalSavings;
  // Reduce max return rate from 12% to 8%
  const safeReturnRate = Math.min(Math.max(0.01, investmentReturnRate), 0.08); // Cap between 1% and 8% 
  
  // Safe iterative approach for compound calculations
  for (let i = 0; i < yearsToRetirement; i++) {
    // Apply growth rate to current principal
    projectedSavings = projectedSavings * (1 + safeReturnRate);
    
    // Add annual contributions
    projectedSavings += annualContributions;
    
    // Safety cap to prevent unrealistic values
    if (projectedSavings > 25000000) { // Cap at $25M instead of $50M
      projectedSavings = 25000000;
      break;
    }
  }

  // Estimated annual retirement income (using 4% withdrawal rule)
  const withdrawalRate = 0.04;
  const estimatedAnnualRetirementIncome = projectedSavings * withdrawalRate;

  // Sustainability score calculation (out of 100)
  let sustainabilityScore = 75; // Default score
  
  // Adjust score based on savings ratio
  const savingsRatio = annualContributions / Math.max(1, annualIncome);
  if (savingsRatio > 0.15) {
    sustainabilityScore += 10;
  } else if (savingsRatio < 0.10) {
    sustainabilityScore -= 10;
  }
  
  // Adjust score based on investment return rate vs withdrawal rate
  if (safeReturnRate > withdrawalRate + 0.02) {
    sustainabilityScore += 15; // Significantly higher returns than withdrawals
  } else if (safeReturnRate > withdrawalRate) {
    sustainabilityScore += 10; // Higher returns than withdrawals
  } else if (safeReturnRate < withdrawalRate - 0.01) {
    sustainabilityScore -= 15; // Lower returns than withdrawals
  }
  
  // Adjust based on years in retirement
  if (yearsInRetirement > 30) {
    sustainabilityScore -= 10; // Long retirement period increases risk
  } else if (yearsInRetirement < 20) {
    sustainabilityScore += 5; // Shorter retirement period reduces risk
  }
  
  // Final clamping
  sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));

  // Calculate success probability
  const successProbability = Math.min(100, Math.max(0, 
    safeReturnRate > withdrawalRate ? 
      80 + (safeReturnRate - withdrawalRate) * 400 : 
      70 - (withdrawalRate - safeReturnRate) * 500
  ));

  // Calculate portfolio longevity
  let portfolioLongevity: number;
  
  if (safeReturnRate > withdrawalRate) {
    portfolioLongevity = lifeExpectancy; // Theoretically sustainable indefinitely
  } else {
    try {
      // Simplified formula for when portfolio depletes
      // Using the formula: N = log(1 - r*P/PMT) / log(1+r) where:
      // N = number of years, r = return rate, P = principal, PMT = annual withdrawal
      const annualWithdrawal = estimatedAnnualRetirementIncome;
      const ratio = annualWithdrawal / (projectedSavings * safeReturnRate);
      
      if (ratio >= 1) {
        // Withdrawals exceed returns, use simplified formula
        const yearsOfRetirement = projectedSavings / annualWithdrawal;
        portfolioLongevity = Math.min(lifeExpectancy, retirementAge + Math.floor(yearsOfRetirement));
      } else {
        // Use more accurate formula for depletion
        const depletion = Math.log(1 - ratio) / Math.log(1 + safeReturnRate);
        
        if (isNaN(depletion) || !isFinite(depletion) || depletion < 0) {
          portfolioLongevity = lifeExpectancy; // Default to life expectancy if calculation fails
        } else {
          portfolioLongevity = Math.min(lifeExpectancy, retirementAge + Math.floor(depletion));
        }
      }
    } catch (e) {
      // Fallback if calculation fails
      portfolioLongevity = Math.min(lifeExpectancy, retirementAge + 20);
    }
  }

  // Generate recommendations
  const recommendations = [];
  if (sustainabilityScore < 60) {
    recommendations.push("Consider increasing your savings rate.");
    recommendations.push("Explore delaying retirement to increase your savings.");
  }
  if (annualContributions < annualIncome * 0.15) {
    recommendations.push("Aim to save at least 15% of your income for retirement.");
  }
  if (successProbability < 70) {
    recommendations.push("Consider more conservative withdrawal rates in retirement.");
  }
  if (portfolioLongevity < lifeExpectancy) {
    recommendations.push("Plan for a longer retirement horizon by increasing savings or reducing expenses.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Your retirement plan appears to be on track. Continue your current savings strategy.");
  }

  // Generate chart data
  const netWorthData = calculateNetWorthProjection(inputs);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);
  
  // Return only properties defined in the RetirementPlan interface
  return {
    totalRetirementSavings: projectedSavings,
    estimatedAnnualRetirementIncome,
    sustainabilityScore,
    successProbability,
    portfolioLongevity,
    recommendations,
    netWorthData,
    incomeSourcesData,
    withdrawalStrategyData,
    riskProfileData,
    socialSecurityData
  };
};
