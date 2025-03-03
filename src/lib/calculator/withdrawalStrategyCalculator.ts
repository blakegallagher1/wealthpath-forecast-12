
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
  for (let i = 0; i < yearsToRetirement; i++) {
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + returnRate) + annualContributions;
  }
  
  // Set a reasonable cap on retirement savings based on contributions and time
  const maxReasonableSavings = Math.max(5000000, annualContributions * yearsToRetirement * 10);
  estimatedRetirementSavings = Math.min(estimatedRetirementSavings, maxReasonableSavings);
  
  // Define withdrawal rates for different strategies
  const conservativeRate = 0.03; // 3% withdrawal
  const moderateRate = 0.04;     // 4% traditional rate
  const aggressiveRate = 0.05;   // 5% withdrawal 
  
  // Portfolio returns during retirement (typically more conservative)
  const postRetirementReturns = {
    conservative: Math.max(returnRate - 0.01, 0.02), // More conservative allocation
    moderate: returnRate - 0.005,                    // Slightly more conservative 
    aggressive: returnRate                           // Maintain pre-retirement allocation
  };
  
  // Initialize account balances for each strategy
  let conservativeBalance = estimatedRetirementSavings;
  let moderateBalance = estimatedRetirementSavings;
  let aggressiveBalance = estimatedRetirementSavings;
  
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
      const inflationMultiplier = Math.pow(1 + inflationRate, yearsSinceRetirement);
      
      // Conservative strategy (3%)
      const conservativeWithdrawal = conservativeBalance * conservativeRate * inflationMultiplier;
      conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * 
                                  (1 + postRetirementReturns.conservative));
      
      // Moderate strategy (4%)
      const moderateWithdrawal = moderateBalance * moderateRate * inflationMultiplier;
      moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * 
                              (1 + postRetirementReturns.moderate));
      
      // Aggressive strategy (5%)
      const aggressiveWithdrawal = aggressiveBalance * aggressiveRate * inflationMultiplier;
      aggressiveBalance = Math.max(0, (aggressiveBalance - aggressiveWithdrawal) * 
                                (1 + postRetirementReturns.aggressive));
      
      // Apply sequence of returns risk factor in early retirement
      if (yearsSinceRetirement <= 5) {
        // Early retirement years are more vulnerable to market downturns
        const sequenceRiskFactor = 0.99; // Small penalty to simulate sequence risk
        conservativeBalance *= sequenceRiskFactor;
        moderateBalance *= sequenceRiskFactor;
        aggressiveBalance *= sequenceRiskFactor;
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
