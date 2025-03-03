
import { CalculatorInputs, IncomeSourcesDataPoint } from "./types";

export function generateIncomeSourcesData(inputs: CalculatorInputs): IncomeSourcesDataPoint[] {
  const data: IncomeSourcesDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const spouseAge = inputs.spouseAge || 0;
  const spouseRetirementAge = inputs.spouseRetirementAge || 0;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  const ssStartAge = inputs.ssStartAge || 67;
  
  // Income growth rate with more conservative cap
  const incomeGrowthRate = Math.min(inputs.incomeGrowthRate || 0.03, 0.04); // Cap at 4%
  const spouseIncomeGrowthRate = Math.min(inputs.spouseIncomeGrowthRate || 0.03, 0.04); // Cap at 4%
  
  // Calculate retirement savings at retirement age (simplified)
  const retirementSavingsAtRetirement = calculateProjectedRetirementSavings(inputs);
  
  // Withdrawal rate from retirement plan
  const withdrawalRate = inputs.retirementWithdrawalRate / 100 || 0.04; // Default to 4%
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    let employment = 0;
    let socialSecurity = 0;
    let retirement = 0;
    let pension = 0;
    let rmd = 0;
    let taxable = 0;
    
    // Calculate corresponding spouse age for this year
    const spouseCurrentAge = spouseAge ? age - currentAge + spouseAge : 0;
    
    if (age < retirementAge) {
      // Pre-retirement: employment income with growth
      const yearsWorking = age - currentAge;
      employment = (inputs.annualIncome || 0) * Math.pow(1 + incomeGrowthRate, yearsWorking);
      employment = Math.min(employment, 400000); // Cap at $400K
      
      // Add spouse income if applicable - but only until spouse's retirement age
      if (inputs.spouseIncome && inputs.spouseIncome > 0 && spouseAge) {
        if (spouseCurrentAge < spouseRetirementAge) {
          const spouseYearsWorking = spouseCurrentAge - spouseAge + (currentAge - spouseAge);
          const spouseIncome = inputs.spouseIncome * Math.pow(1 + spouseIncomeGrowthRate, spouseYearsWorking);
          employment += Math.min(spouseIncome, 400000);
        }
      }
    } else {
      // Post-retirement income sources
      
      // If primary person is retired but spouse is still working
      if (inputs.spouseIncome && inputs.spouseIncome > 0 && spouseAge && spouseCurrentAge < spouseRetirementAge) {
        const spouseYearsWorking = spouseCurrentAge - spouseAge + (currentAge - spouseAge);
        const spouseIncome = inputs.spouseIncome * Math.pow(1 + spouseIncomeGrowthRate, spouseYearsWorking);
        employment += Math.min(spouseIncome, 400000);
      }
      
      // Social Security (starts at SS age)
      if (age >= ssStartAge) {
        // Base Social Security on income or specified benefit
        socialSecurity = inputs.socialSecurityBenefit || 0;
        
        // Add spouse SS if applicable and if spouse has reached SS age
        if (inputs.spouseSocialSecurityBenefit && inputs.spouseSocialSecurityBenefit > 0) {
          // Assuming spouse's SS age is the same as primary
          if (spouseCurrentAge >= ssStartAge) {
            socialSecurity += inputs.spouseSocialSecurityBenefit;
          }
        }
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        pension = inputs.pensionAmount || 0;
      }
      
      // For retirement savings, calculate withdrawals based on the projected savings
      // This should align with the calculations in calculateRetirementPlan
      const yearsIntoRetirement = age - retirementAge;
      
      // Adjusting for inflation erosion in a simplified way
      const inflationAdjustment = Math.pow(1 - (inputs.inflationRate / 100 || 0.02), yearsIntoRetirement);
      const baseWithdrawalThisYear = retirementSavingsAtRetirement * withdrawalRate * inflationAdjustment;
      
      // Required Minimum Distributions after age 72
      if (age >= 72) {
        const rmdPercentage = 0.036 + ((age - 72) * 0.002); // Simplified RMD schedule
        const retirementAccountsAtAge = retirementSavingsAtRetirement * 0.7 * Math.pow(1 - withdrawalRate, yearsIntoRetirement);
        rmd = retirementAccountsAtAge * rmdPercentage;
        
        // Remaining withdrawals come from retirement and taxable
        const remainingNeed = Math.max(0, baseWithdrawalThisYear - rmd);
        retirement = remainingNeed * 0.6;
        taxable = remainingNeed * 0.4;
      } else {
        // Before RMDs
        retirement = baseWithdrawalThisYear * 0.6;
        taxable = baseWithdrawalThisYear * 0.4;
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

// Helper function to calculate projected retirement savings
function calculateProjectedRetirementSavings(inputs: CalculatorInputs): number {
  const yearsUntilRetirement = inputs.retirementAge - inputs.currentAge;
  
  // Current retirement assets
  const currentRetirementAssets = 
    (inputs.retirementAccounts || 0) + 
    (inputs.rothAccounts || 0) + 
    (inputs.taxableInvestments || 0);
  
  // Annual contributions
  const annualContributions = 
    (inputs.annual401kContribution || 0) + 
    (inputs.annualRothContribution || 0) + 
    (inputs.annualTaxableContribution || 0);
  
  // Investment return rate
  const returnRate = inputs.investmentReturnRate / 100 || 0.07;
  
  // Calculate future value using compound interest formula
  // FV = P(1+r)^n + PMT * (((1+r)^n - 1) / r)
  let futureValue = 0;
  
  if (returnRate > 0) {
    futureValue = currentRetirementAssets * Math.pow(1 + returnRate, yearsUntilRetirement) + 
                 annualContributions * ((Math.pow(1 + returnRate, yearsUntilRetirement) - 1) / returnRate);
  } else {
    futureValue = currentRetirementAssets + (annualContributions * yearsUntilRetirement);
  }
  
  return futureValue;
}
