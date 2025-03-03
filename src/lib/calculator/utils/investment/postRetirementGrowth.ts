
import { CalculatorInputs } from "../../types";

/**
 * Calculates investment growth during post-retirement years
 * @param age Current age in the projection
 * @param inputs Calculator input values
 * @param retirementAccounts Current retirement accounts balance
 * @param rothAccounts Current Roth accounts balance
 * @param taxableInvestments Current taxable investments balance
 * @param cashSavings Current cash savings
 * @param actualReturnRate Return rate adjusted for risk and market cycle
 * @param marketCycle Current market cycle value
 * @param withdrawalNeeded Amount to withdraw in retirement
 * @returns Updated values for all investment accounts
 */
export const calculatePostRetirementGrowth = (
  age: number,
  inputs: CalculatorInputs,
  retirementAccounts: number,
  rothAccounts: number,
  taxableInvestments: number,
  cashSavings: number,
  actualReturnRate: number,
  marketCycle: number,
  withdrawalNeeded: number
): {
  retirementAccounts: number;
  rothAccounts: number;
  taxableInvestments: number;
  cashSavings: number;
  marketCycle: number;
} => {
  // Sequence of returns risk: more conservative returns in early retirement
  const retirementYears = age - inputs.retirementAge;
  const sequenceRiskFactor = Math.min(1.0, (retirementYears + 5) / 15); // First 10 years of retirement have reduced returns
  const adjustedReturnRate = actualReturnRate * sequenceRiskFactor;
  
  let newRetirementAccounts = retirementAccounts;
  let newRothAccounts = rothAccounts;
  let newTaxableInvestments = taxableInvestments;
  let newCashSavings = cashSavings;
  
  const totalInvestments = retirementAccounts + rothAccounts + taxableInvestments;
  
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
};
