
import { CalculatorInputs, SocialSecurityDataPoint } from "./types";

export function generateSocialSecurityData(inputs: CalculatorInputs): SocialSecurityDataPoint[] {
  // Base monthly amount (estimated based on income)
  const baseMonthlyBenefit = Math.min(
    (inputs.socialSecurityBenefit || ((inputs.annualIncome || 0) * 0.35)) / 12, // Reduced from 0.4
    3500 // Cap at $3.5K/month (reduced from $4K)
  );
  
  // Life expectancy after age 62
  const lifeExpectancyAfter62 = Math.max(0, (inputs.lifeExpectancy || 90) - 62);
  
  // Calculate benefits at different claiming ages with realistic values
  return [
    {
      claimingAge: 62,
      monthlyBenefit: baseMonthlyBenefit * 0.7, // 30% reduction for early claiming
      lifetimeTotal: baseMonthlyBenefit * 0.7 * 12 * lifeExpectancyAfter62
    },
    {
      claimingAge: 67,
      monthlyBenefit: baseMonthlyBenefit, // Full retirement age
      lifetimeTotal: baseMonthlyBenefit * 12 * Math.max(0, (inputs.lifeExpectancy || 90) - 67)
    },
    {
      claimingAge: 70,
      monthlyBenefit: baseMonthlyBenefit * 1.24, // 24% increase for delayed claiming
      lifetimeTotal: baseMonthlyBenefit * 1.24 * 12 * Math.max(0, (inputs.lifeExpectancy || 90) - 70)
    }
  ];
}
