
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
  
  // Adjust return rate based on risk profile
  let riskAdjustedReturnRate = returnRate;
  if (inputs.riskProfile === "conservative") {
    riskAdjustedReturnRate = Math.max(returnRate * 0.85, 0.03); // Lower bound of 3%
  } else if (inputs.riskProfile === "aggressive") {
    riskAdjustedReturnRate = Math.min(returnRate * 1.15, 0.12); // Upper bound of 12%
  }
  
  // Project savings to retirement with more realistic growth
  for (let i = 0; i < yearsToRetirement; i++) {
    // More realistic compound growth with annual contributions
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + riskAdjustedReturnRate) + annualContributions;
  }
  
  // Apply a more reasonable cap based on contributions and time
  const reasonableCap = Math.max(10000000, annualContributions * yearsToRetirement * 10);
  estimatedRetirementSavings = Math.min(estimatedRetirementSavings, reasonableCap);
  
  // Withdrawal strategies with more accurate modeling
  const conservativeRate = 0.03; // 3% withdrawal - more conservative
  const moderateRate = 0.04;     // 4% traditional withdrawal rate
  const aggressiveRate = 0.05;   // 5% withdrawal - more aggressive
  
  // Post-retirement investment return rates adjusted for withdrawal phase
  // Typically more conservative during drawdown phase
  const portfolioReturnRates = {
    conservative: Math.max(riskAdjustedReturnRate * 0.8, 0.02), // More bonds, lower return
    moderate: Math.max(riskAdjustedReturnRate * 0.9, 0.03),     // Balanced portfolio
    aggressive: riskAdjustedReturnRate * 0.95                   // Still relatively aggressive
  };
  
  // Initial balances
  let conservativeBalance = estimatedRetirementSavings;
  let moderateBalance = estimatedRetirementSavings;
  let aggressiveBalance = estimatedRetirementSavings;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    if (age >= retirementAge) {
      // After retirement, calculate different withdrawal strategies
      
      // Account for inflation in withdrawal amounts
      const yearsSinceRetirement = age - retirementAge;
      const inflationMultiplier = Math.pow(1 + inflationRate, yearsSinceRetirement);
      
      // Conservative (3%) strategy with inflation adjustment
      const conservativeWithdrawalBase = conservativeBalance * conservativeRate;
      const conservativeWithdrawal = conservativeWithdrawalBase * inflationMultiplier;
      conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * 
                                   (1 + portfolioReturnRates.conservative));
      
      // Moderate (4%) strategy with inflation adjustment
      const moderateWithdrawalBase = moderateBalance * moderateRate;
      const moderateWithdrawal = moderateWithdrawalBase * inflationMultiplier;
      moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * 
                               (1 + portfolioReturnRates.moderate));
      
      // Aggressive (5%) strategy with inflation adjustment
      const aggressiveWithdrawalBase = aggressiveBalance * aggressiveRate;
      const aggressiveWithdrawal = aggressiveWithdrawalBase * inflationMultiplier;
      aggressiveBalance = Math.max(0, (aggressiveBalance - aggressiveWithdrawal) * 
                                 (1 + portfolioReturnRates.aggressive));
      
      // Adjust for sequence of returns risk in early retirement years
      // (Simplified model - in reality would use Monte Carlo simulations)
      if (yearsSinceRetirement <= 5) {
        // Early retirement years have higher risk impact
        const sequenceRiskFactor = 0.98; // 2% penalty to simulate sequence risk
        conservativeBalance *= sequenceRiskFactor;
        moderateBalance *= sequenceRiskFactor;
        aggressiveBalance *= sequenceRiskFactor;
      }
    } else {
      // Before retirement, all strategies have the same growth path
      // but with different allocation models (affecting returns)
      conservativeBalance = conservativeBalance * (1 + riskAdjustedReturnRate) + annualContributions;
      moderateBalance = moderateBalance * (1 + riskAdjustedReturnRate) + annualContributions;
      aggressiveBalance = aggressiveBalance * (1 + riskAdjustedReturnRate) + annualContributions;
    }
    
    data.push({
      age,
      year,
      conservative: Math.round(conservativeBalance), // Round to whole numbers for cleaner display
      moderate: Math.round(moderateBalance),
      aggressive: Math.round(aggressiveBalance),
      isRetirementAge
    });
  }
  
  return data;
}
