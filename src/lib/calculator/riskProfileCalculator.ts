
import { CalculatorInputs, RiskProfileDataPoint } from "./types";

export function generateRiskProfileData(inputs: CalculatorInputs): RiskProfileDataPoint[] {
  const data: RiskProfileDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Total current investments
  const totalInvestments = Math.min(
    (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0),
    8000000 // Cap at $8M
  );
  
  // Annual contributions
  const annualContributions = Math.min(
    (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0) + (inputs.annualTaxableContribution || 0),
    80000 // Cap at $80K/year
  );
  
  // Risk profiles with more conservative return rates
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  // Return rates by risk profile
  const conservativeReturnRate = 0.03; // 3% return
  const moderateReturnRate = 0.045;    // 4.5% return
  const aggressiveReturnRate = 0.06;   // 6% return
  
  // Volatility parameters (standard deviation of returns)
  const conservativeVolatility = 0.05;  // 5% volatility
  const moderateVolatility = 0.10;      // 10% volatility
  const aggressiveVolatility = 0.15;    // 15% volatility
  
  // Withdrawal rate in retirement
  const withdrawalRate = 0.04; // 4% withdrawal rate
  
  // Function to generate a random return with volatility
  const getRandomReturn = (baseReturn: number, volatility: number): number => {
    // Normal distribution approximation using Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Apply volatility and add to base return
    return baseReturn + volatility * z;
  };
  
  // Market cycle simulation (bear and bull markets)
  let marketCycle = 0; // 0 = neutral, positive = bull, negative = bear
  let cycleLength = 0;
  const maxCycleLength = 5; // Maximum years in a market cycle
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    // Update market cycle
    if (cycleLength <= 0) {
      // Generate a new market cycle
      marketCycle = (Math.random() - 0.5) * 2; // Between -1 and 1
      cycleLength = Math.floor(Math.random() * maxCycleLength) + 1;
    } else {
      cycleLength--;
      // Gradually return to neutral as cycle ends
      marketCycle *= 0.8;
    }
    
    // Apply market cycle effect to returns
    const cycleFactor = 1 + marketCycle * 0.5; // Adjust returns by up to ±50% based on cycle
    
    // Generate returns with volatility and market cycle effects
    const conservativeReturn = getRandomReturn(conservativeReturnRate, conservativeVolatility) * cycleFactor;
    const moderateReturn = getRandomReturn(moderateReturnRate, moderateVolatility) * cycleFactor;
    const aggressiveReturn = getRandomReturn(aggressiveReturnRate, aggressiveVolatility) * cycleFactor;
    
    // Apply minimum return floor to prevent extreme negative years
    const minReturn = -0.25; // Maximum 25% loss in any year
    const actualConservativeReturn = Math.max(conservativeReturn, minReturn);
    const actualModerateReturn = Math.max(moderateReturn, minReturn);
    const actualAggressiveReturn = Math.max(aggressiveReturn, minReturn);
    
    if (age < retirementAge) {
      // Pre-retirement: growth with contributions
      conservative = conservative * (1 + actualConservativeReturn) + annualContributions;
      moderate = moderate * (1 + actualModerateReturn) + annualContributions;
      aggressive = aggressive * (1 + actualAggressiveReturn) + annualContributions;
    } else {
      // Post-retirement: growth with withdrawals
      // Apply sequence of returns risk - more cautious in early retirement years
      const sequenceRiskFactor = Math.min(1.0, (age - retirementAge + 5) / 15); // First 10 years of retirement have reduced returns
      
      conservative = Math.max(0, conservative * (1 + actualConservativeReturn * sequenceRiskFactor) - conservative * withdrawalRate);
      moderate = Math.max(0, moderate * (1 + actualModerateReturn * sequenceRiskFactor) - moderate * withdrawalRate);
      aggressive = Math.max(0, aggressive * (1 + actualAggressiveReturn * sequenceRiskFactor) - aggressive * withdrawalRate);
    }
    
    // Apply safety caps
    conservative = Math.min(conservative, 8000000);
    moderate = Math.min(moderate, 8000000);
    aggressive = Math.min(aggressive, 8000000);
    
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
