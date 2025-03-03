
import { CalculatorInputs } from "./types";

/**
 * Calculates the growth and changes in investment accounts based on retirement status
 * @param age Current age in the projection
 * @param inputs Calculator input values
 * @param retirementAccounts Current retirement accounts balance
 * @param rothAccounts Current Roth accounts balance
 * @param taxableInvestments Current taxable investments balance
 * @param cashSavings Current cash savings
 * @param annualSavings Annual savings amount
 * @returns Updated values for all investment accounts
 */
export const calculateInvestmentGrowth = (
  age: number,
  inputs: CalculatorInputs,
  retirementAccounts: number,
  rothAccounts: number,
  taxableInvestments: number,
  cashSavings: number,
  annualSavings: number
): {
  retirementAccounts: number;
  rothAccounts: number;
  taxableInvestments: number;
  cashSavings: number;
} => {
  // Pre-retirement: Income and contributions growing
  if (age < inputs.retirementAge) {
    // Apply income growth rate
    const adjustedAnnualSavings = annualSavings * (1 + inputs.incomeGrowthRate / 100);
    
    // Update investment accounts with contributions and growth
    const newRetirementAccounts = retirementAccounts * (1 + inputs.investmentReturnRate / 100) + 
                               inputs.annual401kContribution;
                               
    const newRothAccounts = rothAccounts * (1 + inputs.investmentReturnRate / 100) + 
                          inputs.annualRothContribution;
                          
    const newTaxableInvestments = taxableInvestments * (1 + inputs.investmentReturnRate / 100) + 
                               inputs.annualTaxableContribution;
    
    // Update cash with remaining savings
    const newCashSavings = Math.max(0, cashSavings + adjustedAnnualSavings);
    
    return {
      retirementAccounts: newRetirementAccounts,
      rothAccounts: newRothAccounts,
      taxableInvestments: newTaxableInvestments,
      cashSavings: newCashSavings
    };
  } 
  // Post-retirement: Drawing down accounts
  else {
    const withdrawalRate = inputs.retirementWithdrawalRate / 100;
    
    // Social Security and pension income
    let retirementIncome = 0;
    if (age >= inputs.ssStartAge) {
      retirementIncome += inputs.socialSecurityBenefit * 12;
      // Add spouse social security if applicable
      if (inputs.spouseName && age - inputs.currentAge + inputs.spouseAge >= inputs.ssStartAge) {
        retirementIncome += inputs.spouseSocialSecurityBenefit * 12;
      }
    }
    
    // Add pension if applicable
    if (inputs.hasPension) {
      retirementIncome += inputs.pensionAmount;
    }
    
    // Calculate withdrawal needed after accounting for SS and pension
    const withdrawalNeeded = Math.max(0, inputs.retirementAnnualSpending - retirementIncome);
    
    // Determine withdrawal from each account (simplified strategy)
    const totalInvestments = retirementAccounts + rothAccounts + taxableInvestments;
    
    let newRetirementAccounts = retirementAccounts;
    let newRothAccounts = rothAccounts;
    let newTaxableInvestments = taxableInvestments;
    let newCashSavings = cashSavings;
    
    if (totalInvestments > 0) {
      const retirementPortion = retirementAccounts / totalInvestments;
      const rothPortion = rothAccounts / totalInvestments;
      const taxablePortion = taxableInvestments / totalInvestments;
      
      // Withdraw proportionally from each account
      const retirementWithdrawal = withdrawalNeeded * retirementPortion;
      const rothWithdrawal = withdrawalNeeded * rothPortion;
      const taxableWithdrawal = withdrawalNeeded * taxablePortion;
      
      // Update accounts after withdrawal and growth
      newRetirementAccounts = Math.max(0, (retirementAccounts - retirementWithdrawal) * 
                                     (1 + inputs.investmentReturnRate / 100));
      newRothAccounts = Math.max(0, (rothAccounts - rothWithdrawal) * 
                               (1 + inputs.investmentReturnRate / 100));
      newTaxableInvestments = Math.max(0, (taxableInvestments - taxableWithdrawal) * 
                                    (1 + inputs.investmentReturnRate / 100));
    } else {
      // If investments are depleted, use cash savings
      newCashSavings = Math.max(0, cashSavings - withdrawalNeeded);
    }
    
    return {
      retirementAccounts: newRetirementAccounts,
      rothAccounts: newRothAccounts,
      taxableInvestments: newTaxableInvestments,
      cashSavings: newCashSavings
    };
  }
};
