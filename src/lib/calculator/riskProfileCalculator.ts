
import { CalculatorInputs, RiskProfileDataPoint } from "./types";

export function generateRiskProfileData(inputs: CalculatorInputs): RiskProfileDataPoint[] {
  const data: RiskProfileDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Total current investments
  const totalInvestments = Math.min(
    (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0),
    8000000 // Cap at $8M (reduced from $10M)
  );
  
  // Annual contributions
  const annualContributions = Math.min(
    (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0) + (inputs.annualTaxableContribution || 0),
    80000 // Cap at $80K/year (reduced from $100K)
  );
  
  // Risk profiles with more conservative return rates
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  // Return rates by risk profile - more conservative
  const conservativeReturnRate = 0.04; // 4% return (reduced from 5%)
  const moderateReturnRate = 0.06;     // 6% return (reduced from 7%)
  const aggressiveReturnRate = 0.08;   // 8% return (reduced from 9%)
  
  // Withdrawal rate in retirement
  const withdrawalRate = 0.04; // 4% withdrawal rate
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    if (age < retirementAge) {
      // Pre-retirement: growth with contributions
      conservative = conservative * (1 + conservativeReturnRate) + annualContributions;
      moderate = moderate * (1 + moderateReturnRate) + annualContributions;
      aggressive = aggressive * (1 + aggressiveReturnRate) + annualContributions;
    } else {
      // Post-retirement: growth with withdrawals
      conservative = Math.max(0, conservative * (1 + conservativeReturnRate * 0.9) - conservative * withdrawalRate);
      moderate = Math.max(0, moderate * (1 + moderateReturnRate * 0.9) - moderate * withdrawalRate);
      aggressive = Math.max(0, aggressive * (1 + aggressiveReturnRate * 0.9) - aggressive * withdrawalRate);
    }
    
    // Apply safety caps
    conservative = Math.min(conservative, 8000000); // Reduced from $10M
    moderate = Math.min(moderate, 8000000); // Reduced from $10M
    aggressive = Math.min(aggressive, 8000000); // Reduced from $10M
    
    data.push({
      age,
      year,
      conservative,
      moderate,
      aggressive,
      isRetirementAge
    });
  }
  
  return data;
}
