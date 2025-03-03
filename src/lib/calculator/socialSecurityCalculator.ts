
import { CalculatorInputs, SocialSecurityDataPoint } from "./types";

/**
 * Calculates the Average Indexed Monthly Earnings (AIME) based on annual income
 * This is a simplified calculation that approximates the SSA's method
 */
export function calculateAIME(annualIncome: number): number {
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
export function calculatePIA(aime: number): number {
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
export function adjustPIAForClaimingAge(pia: number, claimingAge: number): number {
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

/**
 * Calculate spousal benefit (up to 50% of primary worker's PIA)
 * Spousal benefits are reduced if claimed before FRA
 */
export function calculateSpousalBenefit(primaryPIA: number, spousePIA: number, claimingAge: number): number {
  // Calculate the maximum spousal benefit (50% of primary worker's PIA)
  const maxSpousalBenefit = primaryPIA * 0.5;
  
  // The higher of their own benefit or spousal benefit
  const ownBenefit = adjustPIAForClaimingAge(spousePIA, claimingAge);
  
  // If claiming before FRA, spousal benefits are reduced
  const fra = 67;
  let adjustedSpousalBenefit = maxSpousalBenefit;
  
  if (claimingAge < fra) {
    const monthsEarly = (fra - claimingAge) * 12;
    // For spousal benefits, reduction is 25/36 of 1% per month for first 36 months
    // and 5/12 of 1% for additional months
    let reductionFactor = 0;
    
    if (monthsEarly <= 36) {
      reductionFactor = monthsEarly * (25/36) * 0.01;
    } else {
      reductionFactor = (36 * (25/36) * 0.01) + ((monthsEarly - 36) * (5/12) * 0.01);
    }
    
    adjustedSpousalBenefit = maxSpousalBenefit * (1 - reductionFactor);
  }
  
  // Return the higher of their own benefit or spousal benefit
  return Math.max(ownBenefit, adjustedSpousalBenefit);
}

/**
 * Estimates Social Security benefit based on annual income and state of residence
 * This is a simplified estimation function that returns monthly benefit amount
 * @param annualIncome Current annual income
 * @param stateOfResidence State of residence (some states tax Social Security differently)
 * @returns Estimated monthly Social Security benefit
 */
export function estimateSocialSecurityBenefit(annualIncome: number, stateOfResidence?: string): number {
  // Skip calculation if income is not provided
  if (!annualIncome) return 0;
  
  // Calculate AIME and PIA
  const aime = calculateAIME(annualIncome);
  let pia = calculatePIA(aime);
  
  // Add state-specific adjustments if needed
  if (stateOfResidence) {
    // Some states don't tax Social Security benefits
    // This is a simplified adjustment factor
    const taxFriendlyStates = [
      "Alaska", "Alabama", "Arizona", "Arkansas", "California", "Delaware", 
      "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", 
      "Iowa", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
      "Michigan", "Mississippi", "Nevada", "New Hampshire", "New Jersey", 
      "New York", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
      "South Carolina", "South Dakota", "Tennessee", "Texas", "Virginia", 
      "Washington", "Wyoming"
    ];
    
    if (taxFriendlyStates.includes(stateOfResidence)) {
      // Slight increase in effective benefit for tax-friendly states
      pia *= 1.03; 
    }
  }
  
  // Cap at realistic maximum ($4,873 in 2024)
  return Math.min(pia, 4873);
}

export function generateSocialSecurityData(inputs: CalculatorInputs): SocialSecurityDataPoint[] {
  // Calculate primary benefit from income
  const aime = calculateAIME(inputs.annualIncome || 0);
  let pia = calculatePIA(aime);
  
  // Cap at realistic maximum ($4,873 in 2024)
  pia = Math.min(pia, 4873);
  
  // Calculate spouse's PIA if applicable
  let spousePia = 0;
  
  if (inputs.spouseIncome && inputs.spouseIncome > 0) {
    // Calculate from spouse income
    const spouseAime = calculateAIME(inputs.spouseIncome || 0);
    spousePia = calculatePIA(spouseAime);
    
    // Cap spouse PIA at realistic maximum
    spousePia = Math.min(spousePia, 4873);
  }
  
  // Life expectancy after age 62
  const lifeExpectancyAfter62 = Math.max(0, (inputs.lifeExpectancy || 90) - 62);
  
  // Calculate benefits at different claiming ages
  return [
    {
      claimingAge: 62,
      monthlyBenefit: adjustPIAForClaimingAge(pia, 62),
      monthlySpouseBenefit: spousePia > 0 ? calculateSpousalBenefit(pia, spousePia, 62) : 0,
      lifetimeTotal: (adjustPIAForClaimingAge(pia, 62) + (spousePia > 0 ? calculateSpousalBenefit(pia, spousePia, 62) : 0)) * 12 * lifeExpectancyAfter62
    },
    {
      claimingAge: 67,
      monthlyBenefit: pia,
      monthlySpouseBenefit: spousePia > 0 ? Math.max(spousePia, pia * 0.5) : 0,
      lifetimeTotal: (pia + (spousePia > 0 ? Math.max(spousePia, pia * 0.5) : 0)) * 12 * Math.max(0, (inputs.lifeExpectancy || 90) - 67)
    },
    {
      claimingAge: 70,
      monthlyBenefit: adjustPIAForClaimingAge(pia, 70),
      monthlySpouseBenefit: spousePia > 0 ? calculateSpousalBenefit(pia, spousePia, 70) : 0, 
      lifetimeTotal: (adjustPIAForClaimingAge(pia, 70) + (spousePia > 0 ? calculateSpousalBenefit(pia, spousePia, 70) : 0)) * 12 * Math.max(0, (inputs.lifeExpectancy || 90) - 70)
    }
  ];
}

