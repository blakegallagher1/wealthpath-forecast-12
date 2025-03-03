
import { CalculatorInputs, WithdrawalStrategyDataPoint } from "./types";

export function generateWithdrawalStrategyData(inputs: CalculatorInputs): WithdrawalStrategyDataPoint[] {
  const data: WithdrawalStrategyDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Calculate projected retirement savings with more realistic approach
  let estimatedRetirementSavings = (inputs.retirementAccounts || 0) + 
                                 (inputs.rothAccounts || 0) + 
                                 (inputs.taxableInvestments || 0);
  
  const annualContributions = (inputs.annual401kContribution || 0) + 
                            (inputs.annualRothContribution || 0) + 
                            (inputs.annualTaxableContribution || 0);
  
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const returnRate = (inputs.investmentReturnRate || 7.0) / 100;
  const inflationRate = (inputs.inflationRate || 2.5) / 100;
  
  // Project savings to retirement with compound growth
  // Using Future Value formula: FV = P(1+r)^n + PMT[(1+r)^n-1]/r
  for (let i = 0; i < yearsToRetirement; i++) {
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + returnRate) + annualContributions;
  }
  
  // Set a reasonable cap on retirement savings based on contributions and time
  const maxReasonableSavings = Math.max(10000000, annualContributions * yearsToRetirement * 15);
  estimatedRetirementSavings = Math.min(estimatedRetirementSavings, maxReasonableSavings);
  
  // Define withdrawal rates for different strategies
  const conservativeRate = 0.03; // 3% withdrawal
  const moderateRate = 0.04;     // 4% traditional rate
  const aggressiveRate = 0.05;   // 5% withdrawal 
  
  // Portfolio asset allocation for each strategy
  const portfolioAllocations = {
    conservative: { stocks: 0.40, bonds: 0.55, cash: 0.05 }, // Lower volatility
    moderate: { stocks: 0.60, bonds: 0.35, cash: 0.05 },    // Balanced
    aggressive: { stocks: 0.80, bonds: 0.15, cash: 0.05 }   // Higher volatility
  };
  
  // Portfolio returns during retirement (based on allocation)
  const postRetirementReturns = {
    conservative: (portfolioAllocations.conservative.stocks * returnRate + 
                  portfolioAllocations.conservative.bonds * (returnRate * 0.4) +
                  portfolioAllocations.conservative.cash * 0.01) - inflationRate,
    moderate: (portfolioAllocations.moderate.stocks * returnRate +
             portfolioAllocations.moderate.bonds * (returnRate * 0.4) +
             portfolioAllocations.moderate.cash * 0.01) - inflationRate,
    aggressive: (portfolioAllocations.aggressive.stocks * returnRate +
               portfolioAllocations.aggressive.bonds * (returnRate * 0.4) +
               portfolioAllocations.aggressive.cash * 0.01) - inflationRate
  };
  
  // Initialize account balances for each strategy
  let conservativeBalance = estimatedRetirementSavings;
  let moderateBalance = estimatedRetirementSavings;
  let aggressiveBalance = estimatedRetirementSavings;
  
  // Variables to store initial withdrawal amounts
  let initialConservativeWithdrawal = 0;
  let initialModerateWithdrawal = 0;
  let initialAggressiveWithdrawal = 0;
  
  // Project for each year from current age to life expectancy
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    if (age < retirementAge) {
      // Pre-retirement: all strategies follow the same growth path
      conservativeBalance = conservativeBalance * (1 + returnRate) + annualContributions;
      moderateBalance = moderateBalance * (1 + returnRate) + annualContributions;
      aggressiveBalance = aggressiveBalance * (1 + returnRate) + annualContributions;
    } else {
      // Post-retirement: apply different withdrawal rates and returns
      const yearsSinceRetirement = age - retirementAge;
      
      // Calculate initial withdrawal amounts at retirement
      if (isRetirementAge) {
        initialConservativeWithdrawal = conservativeBalance * conservativeRate;
        initialModerateWithdrawal = moderateBalance * moderateRate;
        initialAggressiveWithdrawal = aggressiveBalance * aggressiveRate;
      }
      
      // Inflation adjustment for withdrawals in subsequent years
      const inflationMultiplier = Math.pow(1 + inflationRate, yearsSinceRetirement);
      
      // Calculate the actual withdrawal for this year (inflation-adjusted)
      const conservativeWithdrawal = yearsSinceRetirement === 0 
        ? initialConservativeWithdrawal 
        : initialConservativeWithdrawal * inflationMultiplier;
      
      const moderateWithdrawal = yearsSinceRetirement === 0 
        ? initialModerateWithdrawal 
        : initialModerateWithdrawal * inflationMultiplier;
      
      const aggressiveWithdrawal = yearsSinceRetirement === 0 
        ? initialAggressiveWithdrawal 
        : initialAggressiveWithdrawal * inflationMultiplier;
      
      // Apply withdrawals and real returns (already adjusted for inflation)
      conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * 
                                    (1 + postRetirementReturns.conservative));
      
      moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * 
                                (1 + postRetirementReturns.moderate));
      
      aggressiveBalance = Math.max(0, (aggressiveBalance - aggressiveWithdrawal) * 
                                  (1 + postRetirementReturns.aggressive));
      
      // Apply sequence of returns risk factor in early retirement
      if (yearsSinceRetirement <= 5) {
        // Early retirement years are more vulnerable to market downturns
        // Different risk impact based on allocation (more stocks = more sequence risk)
        const conservativeRiskFactor = 0.990 + (Math.random() * 0.02); // Less volatile
        const moderateRiskFactor = 0.980 + (Math.random() * 0.04);     // Moderate volatility
        const aggressiveRiskFactor = 0.970 + (Math.random() * 0.06);   // More volatile
        
        conservativeBalance *= conservativeRiskFactor;
        moderateBalance *= moderateRiskFactor;
        aggressiveBalance *= aggressiveRiskFactor;
      }
    }
    
    // Add data point for this age
    data.push({
      age,
      year,
      conservative: Math.round(conservativeBalance),
      moderate: Math.round(moderateBalance),
      aggressive: Math.round(aggressiveBalance),
      isRetirementAge
    });
  }
  
  return data;
}
