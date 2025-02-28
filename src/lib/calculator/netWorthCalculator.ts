
import { CalculatorInputs, NetWorthDataPoint } from "./types";

export function generateNetWorthData(inputs: CalculatorInputs): NetWorthDataPoint[] {
  const data: NetWorthDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Starting values
  let cash = inputs.cashSavings || 0;
  let retirement = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0);
  let taxable = inputs.taxableInvestments || 0;
  let realEstate = inputs.realEstateEquity || 0;
  
  // Debt (subtract from net worth)
  let mortgageBalance = inputs.mortgageBalance || 0;
  let otherDebt = (inputs.creditCardBalance || 0) + (inputs.autoLoanBalance || 0) + (inputs.studentLoanBalance || 0);
  
  // Growth rates with more conservative caps
  const cashGrowthRate = 0.015; // 1.5% for cash (reduced from 2%)
  const retirementGrowthRate = Math.min(inputs.investmentReturnRate || 0.07, 0.08); // Cap at 8% (reduced from 10%)
  const taxableGrowthRate = Math.min((inputs.investmentReturnRate || 0.07) * 0.85, 0.065); // Cap at 6.5% (reduced from 8.5%)
  const realEstateGrowthRate = 0.025; // 2.5% for real estate (reduced from 3%)
  
  // Annual contributions
  const retirementContribution = (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0);
  const taxableContribution = inputs.annualTaxableContribution || 0;
  
  // Retirement spending
  const retirementSpendingRate = 0.04; // 4% withdrawal rate
  
  // Mortgage paydown (assume 30-year mortgage)
  const mortgagePaymentYears = 30;
  const annualMortgagePaydown = mortgageBalance > 0 ? mortgageBalance / mortgagePaymentYears : 0;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Calculate year's net worth
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    // Apply mortgage paydown if still paying
    if (mortgageBalance > 0 && age < currentAge + mortgagePaymentYears) {
      mortgageBalance = Math.max(0, mortgageBalance - annualMortgagePaydown);
    } else {
      mortgageBalance = 0;
    }
    
    // Reduce other debt over time (10% per year)
    if (otherDebt > 0) {
      otherDebt = Math.max(0, otherDebt * 0.9);
    }
    
    // Apply growth rates with safety caps
    if (age < retirementAge) {
      // Pre-retirement: growth with contributions
      cash = Math.min(cash * (1 + cashGrowthRate) + (inputs.annualIncome || 0) * 0.03, 500000); // Cap cash at $500K
      retirement = Math.min(retirement * (1 + retirementGrowthRate) + retirementContribution, 8000000); // Cap at $8M (reduced from $10M)
      taxable = Math.min(taxable * (1 + taxableGrowthRate) + taxableContribution, 8000000); // Cap at $8M (reduced from $10M)
      realEstate = Math.min(realEstate * (1 + realEstateGrowthRate), 4000000); // Cap at $4M (reduced from $5M)
    } else {
      // Post-retirement: withdrawals
      const totalAssets = cash + retirement + taxable + realEstate;
      const annualWithdrawal = Math.min(totalAssets * retirementSpendingRate, 400000); // Cap at $400K/year (reduced from $500K)
      const withdrawalPerAccount = annualWithdrawal / 4; // Distribute across accounts
      
      // Reduce each account proportionally, but ensure we don't go negative
      cash = Math.max(0, cash * (1 + cashGrowthRate) - withdrawalPerAccount);
      retirement = Math.max(0, retirement * (1 + retirementGrowthRate * 0.9) - withdrawalPerAccount);
      taxable = Math.max(0, taxable * (1 + taxableGrowthRate * 0.9) - withdrawalPerAccount);
      realEstate = Math.max(0, realEstate * (1 + realEstateGrowthRate * 0.9) - withdrawalPerAccount);
    }
    
    // Calculate total net worth (assets minus debts)
    const total = cash + retirement + taxable + realEstate - mortgageBalance - otherDebt;
    
    // Add data point
    data.push({
      age,
      year,
      cash,
      retirement,
      taxable,
      realEstate,
      total,
      isRetirementAge
    });
  }
  
  return data;
}
