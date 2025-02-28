
import { CalculatorInputs, WithdrawalStrategyDataPoint } from "./types";

export function generateWithdrawalStrategyData(inputs: CalculatorInputs): WithdrawalStrategyDataPoint[] {
  const data: WithdrawalStrategyDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Calculate projected retirement savings
  let estimatedRetirementSavings = (inputs.retirementAccounts || 0) + 
                                 (inputs.rothAccounts || 0) + 
                                 (inputs.taxableInvestments || 0);
  
  const annualContributions = (inputs.annual401kContribution || 0) + 
                            (inputs.annualRothContribution || 0) + 
                            (inputs.annualTaxableContribution || 0);
  
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const returnRate = Math.min(inputs.investmentReturnRate || 0.07, 0.07); // Cap at 7% (reduced from 9%)
  
  // Project savings to retirement with a more conservative approach
  for (let i = 0; i < yearsToRetirement; i++) {
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + returnRate) + annualContributions;
    if (estimatedRetirementSavings > 8000000) { // Cap at $8M (reduced from $10M)
      estimatedRetirementSavings = 8000000;
      break;
    }
  }
  
  // Cap estimated retirement savings
  estimatedRetirementSavings = Math.min(estimatedRetirementSavings, 8000000); // Reduced from $10M
  
  // Withdrawal rates
  const conservativeRate = 0.03; // 3% withdrawal
  const moderateRate = 0.04;     // 4% withdrawal
  const aggressiveRate = 0.05;   // 5% withdrawal
  
  // Post-retirement investment return (lower than accumulation phase)
  const retirementGrowthRate = returnRate * 0.8;
  
  // Initial balances
  let conservativeBalance = estimatedRetirementSavings;
  let moderateBalance = estimatedRetirementSavings;
  let aggressiveBalance = estimatedRetirementSavings;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    if (age >= retirementAge) {
      // After retirement, calculate different withdrawal strategies
      
      // Conservative (3%) strategy
      const conservativeWithdrawal = conservativeBalance * conservativeRate;
      conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * (1 + retirementGrowthRate));
      
      // Moderate (4%) strategy
      const moderateWithdrawal = moderateBalance * moderateRate;
      moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * (1 + retirementGrowthRate));
      
      // Aggressive (5%) strategy
      const aggressiveWithdrawal = aggressiveBalance * aggressiveRate;
      aggressiveBalance = Math.max(0, (aggressiveBalance - aggressiveWithdrawal) * (1 + retirementGrowthRate));
    } else {
      // Before retirement, all strategies have the same growth
      conservativeBalance = conservativeBalance * (1 + returnRate) + annualContributions;
      moderateBalance = moderateBalance * (1 + returnRate) + annualContributions;
      aggressiveBalance = aggressiveBalance * (1 + returnRate) + annualContributions;
      
      // Apply safety caps
      conservativeBalance = Math.min(conservativeBalance, 8000000); // Reduced from $10M
      moderateBalance = Math.min(moderateBalance, 8000000); // Reduced from $10M
      aggressiveBalance = Math.min(aggressiveBalance, 8000000); // Reduced from $10M
    }
    
    data.push({
      age,
      year,
      conservative: conservativeBalance,
      moderate: moderateBalance,
      aggressive: aggressiveBalance,
      isRetirementAge
    });
  }
  
  return data;
}
