
import { CalculatorInputs, IncomeSourcesDataPoint } from "./types";

export function generateIncomeSourcesData(inputs: CalculatorInputs): IncomeSourcesDataPoint[] {
  const data: IncomeSourcesDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  const ssStartAge = inputs.ssStartAge || 67;
  
  // Income growth rate with more conservative cap
  const incomeGrowthRate = Math.min(inputs.incomeGrowthRate || 0.03, 0.04); // Cap at 4% (reduced from 5%)
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    let employment = 0;
    let socialSecurity = 0;
    let retirement = 0;
    let pension = 0;
    let rmd = 0;
    let taxable = 0;
    
    if (age < retirementAge) {
      // Pre-retirement: employment income with growth
      const yearsWorking = age - currentAge;
      employment = (inputs.annualIncome || 0) * Math.pow(1 + incomeGrowthRate, yearsWorking);
      employment = Math.min(employment, 400000); // Cap at $400K (reduced from $500K)
      
      // Add spouse income if applicable
      if (inputs.spouseIncome && inputs.spouseIncome > 0 && inputs.spouseAge) {
        const spouseIncomeGrowthRate = Math.min(inputs.spouseIncomeGrowthRate || 0.03, 0.04);
        const spouseIncome = inputs.spouseIncome * Math.pow(1 + spouseIncomeGrowthRate, yearsWorking);
        employment += Math.min(spouseIncome, 400000);
      }
    } else {
      // Post-retirement income sources
      
      // Social Security (starts at SS age)
      if (age >= ssStartAge) {
        // Base Social Security on income, with reasonable min/max
        const baseSS = inputs.socialSecurityBenefit || Math.min(Math.max((inputs.annualIncome || 0) * 0.35, 15000), 40000); // Reduced from 0.4, max $40K
        socialSecurity = Math.min(baseSS, 50000); // Cap at $50K (reduced from $60K)
        
        // Add spouse SS if applicable
        if (inputs.spouseSocialSecurityBenefit && inputs.spouseSocialSecurityBenefit > 0) {
          socialSecurity += Math.min(inputs.spouseSocialSecurityBenefit, 40000); // Reduced from $50K
        }
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        pension = Math.min(inputs.pensionAmount || 0, 120000); // Cap at $120K (reduced from $150K)
      }
      
      // Calculate retirement withdrawals
      const totalAssets = 
        (inputs.retirementAccounts || 0) + 
        (inputs.rothAccounts || 0) + 
        (inputs.taxableInvestments || 0);
      
      // Project asset growth
      const growthYears = retirementAge - currentAge;
      const growthRate = Math.min(inputs.investmentReturnRate || 0.07, 0.07); // Cap at 7% (reduced from 9%)
      const projectedAssets = totalAssets * Math.pow(1 + growthRate, growthYears);
      
      // Annual withdrawals (4% rule)
      const annualWithdrawal = Math.min(projectedAssets * 0.04, 400000); // Cap at $400K/year (reduced from $500K)
      
      // Required Minimum Distributions after age 72
      if (age >= 72) {
        const rmdPercentage = 0.04 + (age - 72) * 0.001; // Increases with age
        rmd = Math.min(projectedAssets * rmdPercentage * 0.7, 150000); // Cap at $150K (reduced from $200K)
        
        // Remaining withdrawals
        const remainingNeed = Math.max(0, annualWithdrawal - rmd - socialSecurity - pension);
        retirement = remainingNeed * 0.6;
        taxable = remainingNeed * 0.4;
      } else {
        // Before RMDs
        const withdrawalNeeded = Math.max(0, annualWithdrawal - socialSecurity - pension);
        retirement = withdrawalNeeded * 0.6;
        taxable = withdrawalNeeded * 0.4;
      }
    }
    
    const total = employment + socialSecurity + retirement + pension + rmd + taxable;
    
    data.push({
      age,
      year,
      employment,
      socialSecurity,
      retirement,
      pension,
      rmd,
      taxable,
      total,
      isRetirementAge
    });
  }
  
  return data;
}
