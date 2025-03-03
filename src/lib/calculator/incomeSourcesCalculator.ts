import { CalculatorInputs, IncomeSourcesDataPoint } from "./types";
import { calculateAIME, calculatePIA, adjustPIAForClaimingAge } from "./socialSecurityCalculator";

export function generateIncomeSourcesData(inputs: CalculatorInputs): IncomeSourcesDataPoint[] {
  const data: IncomeSourcesDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const spouseAge = inputs.spouseAge || 0;
  const spouseRetirementAge = inputs.spouseRetirementAge || 0;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  const ssStartAge = inputs.ssStartAge || 67;
  
  // Income growth rate with more conservative cap
  const incomeGrowthRate = Math.min(inputs.incomeGrowthRate || 0.03, 0.04) / 100; // Cap at 4%
  const spouseIncomeGrowthRate = Math.min(inputs.spouseIncomeGrowthRate || 0.03, 0.04) / 100; // Cap at 4%
  
  // Calculate retirement savings at retirement age (simplified)
  const retirementSavingsAtRetirement = calculateProjectedRetirementSavings(inputs);
  
  // Withdrawal rate from retirement plan
  const withdrawalRate = inputs.retirementWithdrawalRate / 100 || 0.04; // Default to 4%
  
  // Pre-calculate Social Security benefits
  let monthlySSBenefit = 0;
  let monthlySpouseSSBenefit = 0;
  
  // Calculate SS benefits based on income or use provided values
  if (inputs.socialSecurityBenefit && inputs.socialSecurityBenefit > 0) {
    monthlySSBenefit = inputs.socialSecurityBenefit;
  } else {
    // Use highest career income as basis (assume growth continues)
    const highestIncome = inputs.annualIncome * Math.pow(1 + incomeGrowthRate, retirementAge - currentAge);
    const aime = Math.min(highestIncome, 168600) / 12;
    const pia = calculatePIA(aime);
    monthlySSBenefit = adjustPIAForClaimingAge(pia, ssStartAge);
  }
  
  if (inputs.spouseSocialSecurityBenefit && inputs.spouseSocialSecurityBenefit > 0) {
    monthlySpouseSSBenefit = inputs.spouseSocialSecurityBenefit;
  } else if (inputs.spouseIncome && inputs.spouseIncome > 0) {
    const highestSpouseIncome = inputs.spouseIncome * Math.pow(1 + spouseIncomeGrowthRate, spouseRetirementAge - spouseAge);
    const spouseAime = Math.min(highestSpouseIncome, 168600) / 12;
    const spousePia = calculatePIA(spouseAime);
    monthlySpouseSSBenefit = adjustPIAForClaimingAge(spousePia, ssStartAge);
  }
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    let primaryIncome = 0;
    let spouseIncome = 0;
    let socialSecurity = 0;
    let retirement = 0;
    let pension = 0;
    let rmd = 0;
    let taxable = 0;
    
    // Calculate corresponding spouse age for this year
    const spouseCurrentAge = spouseAge ? age - currentAge + spouseAge : 0;
    
    // Calculate primary income (before retirement)
    if (age < retirementAge) {
      const yearsWorking = age - currentAge;
      primaryIncome = (inputs.annualIncome || 0) * Math.pow(1 + incomeGrowthRate, yearsWorking);
      primaryIncome = Math.min(primaryIncome, 400000); // Cap at $400K
    }
    
    // Calculate spouse income (before spouse's retirement)
    if (inputs.spouseIncome && inputs.spouseIncome > 0 && spouseAge) {
      if (spouseCurrentAge < spouseRetirementAge) {
        const spouseYearsWorking = spouseCurrentAge - spouseAge + (currentAge - spouseAge);
        spouseIncome = inputs.spouseIncome * Math.pow(1 + spouseIncomeGrowthRate, spouseYearsWorking);
        spouseIncome = Math.min(spouseIncome, 400000); // Cap at $400K
      }
    }
    
    // Post-retirement income sources
    if (age >= retirementAge) {
      // Social Security (starts at SS age)
      if (age >= ssStartAge) {
        // Add primary SS benefit
        socialSecurity = monthlySSBenefit * 12;
        
        // Add spouse SS if applicable and if spouse has reached SS age
        if (monthlySpouseSSBenefit > 0) {
          // Assuming spouse's SS age is the same as primary
          if (spouseCurrentAge >= ssStartAge) {
            socialSecurity += monthlySpouseSSBenefit * 12;
          }
        }
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        pension = inputs.pensionAmount || 0;
      }
      
      // For retirement savings, calculate withdrawals based on the projected savings
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
    
    const total = primaryIncome + spouseIncome + socialSecurity + retirement + pension + rmd + taxable;
    
    data.push({
      age,
      year,
      primaryIncome,
      spouseIncome,
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

// Helper functions for Social Security calculation
function calculateAIME(annualIncome: number): number {
  // Social Security uses the highest 35 years of earnings
  // For simplicity, we'll assume current income represents career average
  // Adjust income to be within the Social Security wage base limit ($168,600 for 2024)
  const cappedIncome = Math.min(annualIncome, 168600);
  
  // AIME is based on monthly income
  return cappedIncome / 12;
}

function calculatePIA(aime: number): number {
  // PIA formula uses bend points
  // 90% of AIME up to first bend point
  // 32% of AIME between first and second bend points
  // 15% of AIME above second bend point
  const firstBendPoint = 1174;
  const secondBendPoint = 7084;
  
  let pia = 0;
  
  if (aime <= firstBendPoint) {
    pia = aime * 0.9;
  } else if (aime <= secondBendPoint) {
    pia = (firstBendPoint * 0.9) + ((aime - firstBendPoint) * 0.32);
  } else {
    pia = (firstBendPoint * 0.9) + ((secondBendPoint - firstBendPoint) * 0.32) + ((aime - secondBendPoint) * 0.15);
  }
  
  // Round to nearest dollar as Social Security does
  return Math.round(pia);
}

function adjustPIAForClaimingAge(pia: number, claimingAge: number): number {
  // Full retirement age (FRA) is 67 for those born in 1960 or later
  const fra = 67;
  
  if (claimingAge === fra) {
    // At FRA, receive 100% of PIA
    return pia;
  } else if (claimingAge < fra) {
    // Before FRA, reduce by 5/9 of 1% for each month up to 36 months
    // and 5/12 of 1% for each additional month
    const monthsEarly = (fra - claimingAge) * 12;
    let reductionFactor = 0;
    
    if (monthsEarly <= 36) {
      reductionFactor = monthsEarly * (5/9) * 0.01;
    } else {
      reductionFactor = (36 * (5/9) * 0.01) + ((monthsEarly - 36) * (5/12) * 0.01);
    }
    
    return pia * (1 - reductionFactor);
  } else {
    // After FRA, increase by 8% per year (2/3 of 1% per month)
    const monthsLate = (claimingAge - fra) * 12;
    const increaseFactor = monthsLate * (2/3) * 0.01;
    
    return pia * (1 + increaseFactor);
  }
}
