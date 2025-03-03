
import { CalculatorInputs } from "../../types";

/**
 * Calculates investment growth during pre-retirement years
 * @param inputs Calculator input values
 * @param retirementAccounts Current retirement accounts balance
 * @param rothAccounts Current Roth accounts balance
 * @param taxableInvestments Current taxable investments balance
 * @param cashSavings Current cash savings
 * @param annualSavings Annual savings amount
 * @param actualReturnRate Return rate adjusted for risk and market cycle
 * @param marketCycle Current market cycle value
 * @returns Updated values for all investment accounts
 */
export const calculatePreRetirementGrowth = (
  inputs: CalculatorInputs,
  retirementAccounts: number,
  rothAccounts: number,
  taxableInvestments: number,
  cashSavings: number,
  annualSavings: number,
  actualReturnRate: number,
  marketCycle: number
): {
  retirementAccounts: number;
  rothAccounts: number;
  taxableInvestments: number;
  cashSavings: number;
  marketCycle: number;
} => {
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
};
