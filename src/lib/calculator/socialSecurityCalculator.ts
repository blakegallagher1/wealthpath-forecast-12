import { CalculatorInputs, SocialSecurityDataPoint } from "./types";

/**
 * Calculates the Average Indexed Monthly Earnings (AIME) based on annual income
 * This is a simplified calculation that approximates the SSA's method
 */
function calculateAIME(annualIncome: number): number {
  // Social Security uses the highest 35 years of earnings
  // For simplicity, we'll assume current income represents career average
  // Adjust income to be within the Social Security wage base limit ($168,600 for 2024)
  const cappedIncome = Math.min(annualIncome, 168600);
  
  // AIME is based on monthly income
  return cappedIncome / 12;
}

/**
 * Calculates the Primary Insurance Amount (PIA) based on AIME
 * Using the 2024 bend points: $1,174 and $7,084
 */
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

/**
 * Apply age-based adjustments to PIA based on claiming age
 */
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

export function generateSocialSecurityData(inputs: CalculatorInputs): SocialSecurityDataPoint[] {
  // Calculate base benefit using income if SS benefit not specified
  let pia = 0;
  
  if (inputs.socialSecurityBenefit && inputs.socialSecurityBenefit > 0) {
    // If user has specified a value, use that as the PIA (at full retirement age)
    pia = inputs.socialSecurityBenefit;
  } else {
    // Otherwise calculate from income
    const aime = calculateAIME(inputs.annualIncome || 0);
    pia = calculatePIA(aime);
  }
  
  // Cap at realistic maximum ($4,873 in 2024)
  pia = Math.min(pia, 4873);
  
  // Calculate spouse's PIA if applicable
  let spousePia = 0;
  
  if (inputs.spouseSocialSecurityBenefit && inputs.spouseSocialSecurityBenefit > 0) {
    // If user has specified a spouse value, use that as the spouse PIA
    spousePia = inputs.spouseSocialSecurityBenefit;
  } else if (inputs.spouseIncome && inputs.spouseIncome > 0) {
    // Otherwise calculate from spouse income
    const spouseAime = calculateAIME(inputs.spouseIncome || 0);
    spousePia = calculatePIA(spouseAime);
  }
  
  // Cap spouse PIA at realistic maximum
  spousePia = Math.min(spousePia, 4873);
  
  // Life expectancy after age 62
  const lifeExpectancyAfter62 = Math.max(0, (inputs.lifeExpectancy || 90) - 62);
  
  // Calculate benefits at different claiming ages
  return [
    {
      claimingAge: 62,
      monthlyBenefit: adjustPIAForClaimingAge(pia, 62) + (spousePia > 0 ? adjustPIAForClaimingAge(spousePia, 62) : 0),
      lifetimeTotal: (adjustPIAForClaimingAge(pia, 62) + (spousePia > 0 ? adjustPIAForClaimingAge(spousePia, 62) : 0)) * 12 * lifeExpectancyAfter62
    },
    {
      claimingAge: 67,
      monthlyBenefit: pia + spousePia,
      lifetimeTotal: (pia + spousePia) * 12 * Math.max(0, (inputs.lifeExpectancy || 90) - 67)
    },
    {
      claimingAge: 70,
      monthlyBenefit: adjustPIAForClaimingAge(pia, 70) + (spousePia > 0 ? adjustPIAForClaimingAge(spousePia, 70) : 0),
      lifetimeTotal: (adjustPIAForClaimingAge(pia, 70) + (spousePia > 0 ? adjustPIAForClaimingAge(spousePia, 70) : 0)) * 12 * Math.max(0, (inputs.lifeExpectancy || 90) - 70)
    }
  ];
}
