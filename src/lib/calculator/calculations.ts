
import { CalculatorInputs, RetirementPlan, NetWorthDataPoint, IncomeSourcesDataPoint, WithdrawalStrategyDataPoint, RiskProfileDataPoint, SocialSecurityDataPoint } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    annualIncome,
    incomeGrowthRate,
    cashSavings,
    retirementAccounts,
    rothAccounts,
    taxableInvestments,
    realEstateEquity,
    annual401kContribution,
    annualRothContribution,
    annualTaxableContribution,
    investmentReturnRate
  } = inputs;

  // Basic calculations
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const totalRetirementSavings = retirementAccounts + rothAccounts + taxableInvestments;

  // Calculate future value of current savings
  const returnRate = investmentReturnRate || 0.07; // Default to 7% if not specified
  
  // Projected retirement savings calculation
  const projectedRetirementSavings = 
    // Future value of current retirement accounts
    totalRetirementSavings * Math.pow(1 + returnRate, yearsToRetirement) +
    // Future value of annual contributions (retirement accounts)
    annual401kContribution * ((Math.pow(1 + returnRate, yearsToRetirement) - 1) / returnRate) * (1 + returnRate) +
    // Future value of annual Roth contributions
    annualRothContribution * ((Math.pow(1 + returnRate, yearsToRetirement) - 1) / returnRate) * (1 + returnRate) +
    // Future value of annual taxable contributions
    annualTaxableContribution * ((Math.pow(1 + returnRate, yearsToRetirement) - 1) / returnRate) * (1 + returnRate);

  // Estimated annual retirement income (simplified)
  const estimatedAnnualRetirementIncome = projectedRetirementSavings * 0.04; // 4% withdrawal rate

  // Sustainability score (out of 100, higher is better)
  const sustainabilityScore = Math.min(
    100,
    Math.max(0, yearsInRetirement > 0 ? 100 - (yearsInRetirement - 20) * 5 : 100)
  );

  // Success probability (percentage)
  const successProbability = Math.min(
    100,
    Math.max(0, yearsInRetirement > 0 ? 100 - (yearsInRetirement - 25) * 4 : 100)
  );

  const portfolioLongevity = retirementAge + yearsInRetirement;

  const recommendations = [];
  if (sustainabilityScore < 60) {
    recommendations.push("Consider increasing your savings rate.");
  }
  if (successProbability < 70) {
    recommendations.push("Explore more aggressive investment strategies.");
  }
  if (portfolioLongevity < lifeExpectancy) {
    recommendations.push("Plan for a longer retirement horizon.");
  }

  // Generate chart data
  const netWorthData = generateNetWorthData(inputs);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);
  
  return {
    totalRetirementSavings: projectedRetirementSavings, // Update to use projected value
    estimatedAnnualRetirementIncome,
    sustainabilityScore,
    successProbability,
    portfolioLongevity,
    recommendations,
    netWorthData,
    incomeSourcesData,
    withdrawalStrategyData,
    riskProfileData,
    socialSecurityData
  };
};

// Sample data generation functions
function generateNetWorthData(inputs: CalculatorInputs): NetWorthDataPoint[] {
  const data: NetWorthDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  let cash = inputs.cashSavings;
  let retirement = inputs.retirementAccounts + inputs.rothAccounts;
  let taxable = inputs.taxableInvestments;
  let realEstate = inputs.realEstateEquity;
  
  // Use more realistic growth rates
  const cashGrowthRate = 0.02; // 2% for cash
  const retirementGrowthRate = inputs.investmentReturnRate || 0.07; // Default 7% for retirement accounts
  const taxableGrowthRate = inputs.investmentReturnRate * 0.85 || 0.06; // Slightly lower due to taxes
  const realEstateGrowthRate = 0.04; // 4% for real estate
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Simple growth model
    if (age < retirementAge) {
      cash *= (1 + cashGrowthRate);
      retirement *= (1 + retirementGrowthRate);
      taxable *= (1 + taxableGrowthRate);
      realEstate *= (1 + realEstateGrowthRate);
      
      // Add contributions
      retirement += inputs.annual401kContribution + inputs.annualRothContribution;
      taxable += inputs.annualTaxableContribution;
      
      // Add income that's saved to cash
      const savingsRateForCash = 0.05; // 5% of income goes to cash savings
      cash += inputs.annualIncome * savingsRateForCash;
    } else {
      // After retirement, different growth rates and withdrawals
      cash *= (1 + cashGrowthRate * 0.5); // Lower cash returns in retirement
      retirement *= (1 + retirementGrowthRate * 0.8); // Slightly lower returns in retirement
      taxable *= (1 + taxableGrowthRate * 0.8);
      realEstate *= (1 + realEstateGrowthRate * 0.75);
      
      // Simulate withdrawals for retirement expenses
      const withdrawalRate = 0.04; // 4% withdrawal rate
      const totalPortfolio = cash + retirement + taxable + realEstate;
      const withdrawalAmount = totalPortfolio * withdrawalRate / 3; // Evenly distributed
      
      cash = Math.max(0, cash - withdrawalAmount);
      retirement = Math.max(0, retirement - withdrawalAmount);
      taxable = Math.max(0, taxable - withdrawalAmount);
    }
    
    const total = cash + retirement + taxable + realEstate;
    
    data.push({
      age,
      cash,
      retirement,
      taxable,
      realEstate,
      total,
    });
  }
  
  return data;
}

function generateIncomeSourcesData(inputs: CalculatorInputs): IncomeSourcesDataPoint[] {
  const data: IncomeSourcesDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  const ssStartAge = Math.max(inputs.ssStartAge || 67, retirementAge);
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    let employment = 0;
    let socialSecurity = 0;
    let retirement = 0;
    let pension = 0;
    let rmd = 0;
    let taxable = 0;
    
    if (age < retirementAge) {
      // Before retirement: employment income with growth
      employment = inputs.annualIncome * Math.pow(1 + (inputs.incomeGrowthRate || 0.03), age - currentAge);
    } else {
      // After retirement
      
      // Social Security
      if (age >= ssStartAge) {
        socialSecurity = inputs.socialSecurityBenefit || (inputs.annualIncome * 0.4); // 40% of pre-retirement income
      }
      
      // Pension if any
      if (inputs.hasPension) {
        pension = inputs.pensionAmount || 0;
      }
      
      // Calculate withdrawal needs
      const incomeNeeded = inputs.retirementAnnualSpending || (inputs.annualIncome * 0.7); // 70% of pre-retirement income
      const remainingNeed = Math.max(0, incomeNeeded - socialSecurity - pension);
      
      if (age >= 72) {
        // Required Minimum Distributions (RMDs) after age 72
        // Simplified RMD calculation
        const retirementBalance = inputs.retirementAccounts * Math.pow(1.07, retirementAge - currentAge);
        const rmdRate = 0.04 + (age - 72) * 0.001; // Increases with age
        rmd = retirementBalance * rmdRate;
        
        // Remaining withdrawals
        const afterRmdNeed = Math.max(0, remainingNeed - rmd);
        retirement = afterRmdNeed * 0.4;
        taxable = afterRmdNeed * 0.6;
      } else {
        // Before RMDs
        retirement = remainingNeed * 0.6;
        taxable = remainingNeed * 0.4;
      }
    }
    
    data.push({
      age,
      employment,
      socialSecurity,
      retirement,
      pension,
      rmd,
      taxable,
    });
  }
  
  return data;
}

function generateWithdrawalStrategyData(inputs: CalculatorInputs): WithdrawalStrategyDataPoint[] {
  const data: WithdrawalStrategyDataPoint[] = [];
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Calculate projected retirement savings at retirement
  const yearsToRetirement = retirementAge - inputs.currentAge;
  const returnRate = inputs.investmentReturnRate || 0.07;
  
  // Initial retirement portfolio
  const totalRetirementSavings = 
    (inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments) * 
    Math.pow(1 + returnRate, yearsToRetirement) +
    (inputs.annual401kContribution + inputs.annualRothContribution + inputs.annualTaxableContribution) * 
    ((Math.pow(1 + returnRate, yearsToRetirement) - 1) / returnRate) * (1 + returnRate);
  
  let conservativeBalance = totalRetirementSavings;
  let moderateBalance = totalRetirementSavings;
  let aggressiveBalance = totalRetirementSavings;
  
  // Portfolio growth rate in retirement (slightly lower than accumulation phase)
  const retirementGrowthRate = returnRate * 0.9;
  
  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    // Conservative withdrawal rate: 3%
    let conservativeWithdrawal = conservativeBalance * 0.03;
    conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * (1 + retirementGrowthRate));
    
    // Moderate withdrawal rate: 4%
    let moderateWithdrawal = moderateBalance * 0.04;
    moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * (1 + retirementGrowthRate));
    
    // Aggressive withdrawal rate: 5%
    let aggressiveWithdrawal = aggressiveBalance * 0.05;
    aggressiveBalance = Math.max(0, (aggressiveBalance - aggressiveWithdrawal) * (1 + retirementGrowthRate));
    
    data.push({
      age,
      conservative: conservativeBalance,
      moderate: moderateBalance,
      aggressive: aggressiveBalance,
    });
  }
  
  return data;
}

function generateRiskProfileData(inputs: CalculatorInputs): RiskProfileDataPoint[] {
  const data: RiskProfileDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  const totalInvestments = inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments;
  const annualContributions = inputs.annual401kContribution + inputs.annualRothContribution + inputs.annualTaxableContribution;
  
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  // Different return rates based on risk profile
  const conservativeReturnRate = 0.05; // 5% return
  const moderateReturnRate = 0.07; // 7% return
  const aggressiveReturnRate = 0.09; // 9% return
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    if (age < retirementAge) {
      // During accumulation phase
      conservative = conservative * (1 + conservativeReturnRate) + annualContributions;
      moderate = moderate * (1 + moderateReturnRate) + annualContributions;
      aggressive = aggressive * (1 + aggressiveReturnRate) + annualContributions;
    } else {
      // During retirement phase
      const withdrawalRate = 0.04; // 4% withdrawal
      
      conservative = Math.max(0, conservative * (1 + conservativeReturnRate * 0.8) - conservative * withdrawalRate);
      moderate = Math.max(0, moderate * (1 + moderateReturnRate * 0.8) - moderate * withdrawalRate);
      aggressive = Math.max(0, aggressive * (1 + aggressiveReturnRate * 0.8) - aggressive * withdrawalRate);
    }
    
    data.push({
      age,
      conservative,
      moderate,
      aggressive,
    });
  }
  
  return data;
}

function generateSocialSecurityData(inputs: CalculatorInputs): SocialSecurityDataPoint[] {
  // Base amount from inputs or estimated as percentage of income
  const baseAmount = inputs.socialSecurityBenefit || (inputs.annualIncome * 0.4 / 12); // 40% of pre-retirement income, monthly
  
  return [
    { claimingAge: 62, monthlyBenefit: baseAmount * 0.7 }, // Early claiming penalty
    { claimingAge: 67, monthlyBenefit: baseAmount }, // Full retirement age
    { claimingAge: 70, monthlyBenefit: baseAmount * 1.24 }, // Delayed retirement credits
  ];
}
