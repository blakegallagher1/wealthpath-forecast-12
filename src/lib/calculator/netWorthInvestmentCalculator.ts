
import { CalculatorInputs } from "./types";

/**
 * Generates a random market return with volatility based on a normal distribution
 * @param baseReturn Base expected return
 * @param volatility Standard deviation of returns (volatility)
 * @returns A random return rate
 */
const generateMarketReturn = (baseReturn: number, volatility: number): number => {
  // Normal distribution approximation using Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  
  // Apply volatility and add to base return
  const randomReturn = baseReturn + volatility * z;
  
  // Apply a floor to prevent extreme negative returns
  return Math.max(randomReturn, -0.25); // Maximum 25% loss in any year
};

/**
 * Calculates the growth and changes in investment accounts based on retirement status
 * @param age Current age in the projection
 * @param inputs Calculator input values
 * @param retirementAccounts Current retirement accounts balance
 * @param rothAccounts Current Roth accounts balance
 * @param taxableInvestments Current taxable investments balance
 * @param cashSavings Current cash savings
 * @param annualSavings Annual savings amount
 * @param marketCycle Current market cycle factor (-1 to 1, where negative is bear market)
 * @param retirementWithdrawalAmount Amount to withdraw in retirement
 * @param retirementIncome Other retirement income (SS, pension)
 * @returns Updated values for all investment accounts and the new market cycle
 */
export const calculateInvestmentGrowth = (
  age: number,
  inputs: CalculatorInputs,
  retirementAccounts: number,
  rothAccounts: number,
  taxableInvestments: number,
  cashSavings: number,
  annualSavings: number,
  marketCycle: number,
  retirementWithdrawalAmount: number = 0,
  retirementIncome: number = 0
): {
  retirementAccounts: number;
  rothAccounts: number;
  taxableInvestments: number;
  cashSavings: number;
  marketCycle: number;
} => {
  // Update market cycle: gradually mean-revert or occasionally change direction
  const cycleChangeChance = 0.15; // 15% chance of changing market regime each year
  
  if (Math.random() < cycleChangeChance) {
    // Generate a new market cycle between -1 (bear) and 1 (bull)
    marketCycle = (Math.random() - 0.5) * 2;
  } else {
    // Mean reversion - gradually return toward neutral
    marketCycle *= 0.8;
  }
  
  // Base return rate from user input
  const baseReturnRate = inputs.investmentReturnRate / 100;
  
  // Adjust return based on risk profile
  let volatility = 0.10; // Default volatility (moderate)
  if (inputs.riskProfile === "conservative") {
    volatility = 0.05; // Lower volatility for conservative profile
  } else if (inputs.riskProfile === "aggressive") {
    volatility = 0.15; // Higher volatility for aggressive profile
  }
  
  // Apply market cycle effect to returns (±50% adjustment based on cycle)
  const cycleFactor = 1 + marketCycle * 0.5;
  
  // Generate this year's return with volatility and market cycle effects
  const actualReturnRate = generateMarketReturn(baseReturnRate, volatility) * cycleFactor;
  
  // Pre-retirement: Income and contributions growing
  if (age < inputs.retirementAge) {
    // Apply income growth rate
    const adjustedAnnualSavings = annualSavings * (1 + inputs.incomeGrowthRate / 100);
    
    // Update investment accounts with contributions and growth
    const newRetirementAccounts = retirementAccounts * (1 + actualReturnRate) + 
                               inputs.annual401kContribution;
                               
    const newRothAccounts = rothAccounts * (1 + actualReturnRate) + 
                          inputs.annualRothContribution;
                          
    const newTaxableInvestments = taxableInvestments * (1 + actualReturnRate) + 
                               inputs.annualTaxableContribution;
    
    // Update cash with remaining savings
    const newCashSavings = Math.max(0, cashSavings + adjustedAnnualSavings);
    
    return {
      retirementAccounts: newRetirementAccounts,
      rothAccounts: newRothAccounts,
      taxableInvestments: newTaxableInvestments,
      cashSavings: newCashSavings,
      marketCycle: marketCycle
    };
  } 
  // Post-retirement: Drawing down accounts
  else {
    // Sequence of returns risk: more conservative returns in early retirement
    const retirementYears = age - inputs.retirementAge;
    const sequenceRiskFactor = Math.min(1.0, (retirementYears + 5) / 15); // First 10 years of retirement have reduced returns
    const adjustedReturnRate = actualReturnRate * sequenceRiskFactor;
    
    // Calculate withdrawal needed
    const withdrawalNeeded = retirementWithdrawalAmount;
    
    // Determine withdrawal from each account (smart withdrawal strategy)
    const totalInvestments = retirementAccounts + rothAccounts + taxableInvestments;
    
    let newRetirementAccounts = retirementAccounts;
    let newRothAccounts = rothAccounts;
    let newTaxableInvestments = taxableInvestments;
    let newCashSavings = cashSavings;
    
    if (totalInvestments > 0) {
      // Smart withdrawal strategy with smoother transitions
      // 1. Prioritize taxable accounts first
      const taxableWithdrawalPortion = Math.min(1.0, taxableInvestments / (totalInvestments * 0.5));
      const taxableWithdrawal = Math.min(taxableInvestments, withdrawalNeeded * taxableWithdrawalPortion);
      const remainingWithdrawal = withdrawalNeeded - taxableWithdrawal;
      
      // 2. Proportionally split remaining withdrawal between retirement and Roth
      let retirementWithdrawal = 0;
      let rothWithdrawal = 0;
      
      if (retirementAccounts + rothAccounts > 0) {
        const retirementPortion = retirementAccounts / (retirementAccounts + rothAccounts);
        retirementWithdrawal = remainingWithdrawal * retirementPortion;
        rothWithdrawal = remainingWithdrawal * (1 - retirementPortion);
      }
      
      // 3. Cap withdrawals to prevent negative balances
      retirementWithdrawal = Math.min(retirementAccounts * 0.9, retirementWithdrawal);
      rothWithdrawal = Math.min(rothAccounts * 0.9, rothWithdrawal);
      
      // 4. Update accounts after withdrawal and growth
      newTaxableInvestments = Math.max(0, (taxableInvestments - taxableWithdrawal) * 
                                    (1 + adjustedReturnRate));
      newRetirementAccounts = Math.max(0, (retirementAccounts - retirementWithdrawal) * 
                                     (1 + adjustedReturnRate));
      newRothAccounts = Math.max(0, (rothAccounts - rothWithdrawal) * 
                               (1 + adjustedReturnRate));
    } else {
      // If investments are depleted, use cash savings
      const cashWithdrawal = Math.min(cashSavings, withdrawalNeeded);
      newCashSavings = Math.max(0, cashSavings - cashWithdrawal);
    }
    
    return {
      retirementAccounts: newRetirementAccounts,
      rothAccounts: newRothAccounts,
      taxableInvestments: newTaxableInvestments,
      cashSavings: newCashSavings,
      marketCycle: marketCycle
    };
  }
};
