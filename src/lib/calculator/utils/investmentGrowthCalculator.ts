
import { CalculatorInputs } from "../types";
import { generateMarketReturn } from "./investmentReturnUtils";
import { updateMarketCycle } from "./marketCycleHelpers";
import { 
  calculatePreRetirementGrowth,
  calculatePostRetirementGrowth
} from "./retirementAccountUtils";

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
  // Update market cycle
  const updatedMarketCycle = updateMarketCycle(marketCycle);
  
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
  const cycleFactor = 1 + updatedMarketCycle * 0.5;
  
  // Generate this year's return with volatility and market cycle effects
  const actualReturnRate = generateMarketReturn(baseReturnRate, volatility) * cycleFactor;
  
  // Pre-retirement: Income and contributions growing
  if (age < inputs.retirementAge) {
    return calculatePreRetirementGrowth(
      inputs,
      retirementAccounts,
      rothAccounts,
      taxableInvestments,
      cashSavings,
      annualSavings,
      actualReturnRate,
      updatedMarketCycle
    );
  } 
  // Post-retirement: Drawing down accounts
  else {
    return calculatePostRetirementGrowth(
      age,
      inputs,
      retirementAccounts,
      rothAccounts,
      taxableInvestments,
      cashSavings,
      actualReturnRate,
      updatedMarketCycle,
      retirementWithdrawalAmount
    );
  }
};
