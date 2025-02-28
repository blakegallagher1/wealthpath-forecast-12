import { CalculatorInputs, RetirementPlan, NetWorthDataPoint, IncomeSourcesDataPoint, WithdrawalStrategyDataPoint, RiskProfileDataPoint, SocialSecurityDataPoint } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    annualIncome,
    cashSavings,
    retirementAccounts,
    rothAccounts,
    taxableInvestments,
    realEstateEquity,
    annual401kContribution,
  } = inputs;

  // Basic calculations
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const totalRetirementSavings = retirementAccounts + rothAccounts + taxableInvestments;

  // Projected retirement savings (simplified)
  const projectedRetirementSavings =
    totalRetirementSavings * Math.pow(1.07, yearsToRetirement) +
    annual401kContribution *
      ((Math.pow(1.07, yearsToRetirement) - 1) / 0.07);

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

  // Generate sample chart data
  const netWorthData = generateNetWorthData(inputs);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);
  
  return {
    currentAge,
    retirementAge,
    lifeExpectancy,
    annualIncome,
    cashSavings,
    retirementAccounts,
    rothAccounts,
    taxableInvestments,
    realEstateEquity,
    annual401kContribution,
    yearsToRetirement,
    yearsInRetirement,
    totalRetirementSavings,
    projectedRetirementSavings,
    estimatedAnnualRetirementIncome,
    sustainabilityScore,
    successProbability,
    portfolioLongevity,
    recommendations,
    netWorthData,
    incomeSourcesData,
    withdrawalStrategyData,
    riskProfileData,
    socialSecurityData,
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
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Simple growth model
    if (age < retirementAge) {
      cash *= 1.02; // 2% growth for cash
      retirement *= 1.07; // 7% growth for retirement accounts
      taxable *= 1.06; // 6% growth for taxable investments
      realEstate *= 1.04; // 4% growth for real estate
      
      // Add contributions
      retirement += inputs.annual401kContribution;
    } else {
      // After retirement, different growth rates and withdrawals
      cash *= 1.01; // 1% growth for cash
      retirement *= 1.05; // 5% growth for retirement accounts
      taxable *= 1.04; // 4% growth for taxable investments
      realEstate *= 1.03; // 3% growth for real estate
      
      // Simulate withdrawals
      const withdrawalAmount = (inputs.annualIncome * 0.7) / 3; // 70% of pre-retirement income divided across accounts
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
  const ssStartAge = Math.max(62, retirementAge);
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    let employment = 0;
    let socialSecurity = 0;
    let retirement = 0;
    let pension = 0;
    let rmd = 0;
    let taxable = 0;
    
    if (age < retirementAge) {
      employment = inputs.annualIncome;
    } else {
      if (age >= ssStartAge) {
        // Simplified Social Security calculation
        socialSecurity = inputs.annualIncome * 0.4; // 40% of pre-retirement income
      }
      
      // Retirement withdrawals
      const incomeNeeded = inputs.annualIncome * 0.7; // 70% of pre-retirement income
      const remainingNeed = incomeNeeded - socialSecurity - pension;
      
      if (age >= 72) {
        // Required Minimum Distributions (RMDs)
        rmd = remainingNeed * 0.3;
        retirement = remainingNeed * 0.4;
        taxable = remainingNeed * 0.3;
      } else {
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
  
  const totalRetirementSavings = inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments;
  
  let conservativeBalance = totalRetirementSavings;
  let moderateBalance = totalRetirementSavings;
  let aggressiveBalance = totalRetirementSavings;
  
  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    // Conservative withdrawal rate: 3%
    let conservativeWithdrawal = conservativeBalance * 0.03;
    conservativeBalance = (conservativeBalance - conservativeWithdrawal) * 1.05; // 5% growth
    
    // Moderate withdrawal rate: 4%
    let moderateWithdrawal = moderateBalance * 0.04;
    moderateBalance = (moderateBalance - moderateWithdrawal) * 1.05; // 5% growth
    
    // Aggressive withdrawal rate: 5%
    let aggressiveWithdrawal = aggressiveBalance * 0.05;
    aggressiveBalance = (aggressiveBalance - aggressiveWithdrawal) * 1.05; // 5% growth
    
    data.push({
      age,
      conservative: Math.max(0, conservativeBalance),
      moderate: Math.max(0, moderateBalance),
      aggressive: Math.max(0, aggressiveBalance),
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
  
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    if (age < retirementAge) {
      // Different growth rates based on risk profile
      conservative *= 1.04; // 4% return
      moderate *= 1.06; // 6% return
      aggressive *= 1.08; // 8% return
      
      // Add annual contributions
      conservative += inputs.annual401kContribution;
      moderate += inputs.annual401kContribution;
      aggressive += inputs.annual401kContribution;
    } else {
      // After retirement: growth minus withdrawals
      const withdrawalAmount = inputs.annualIncome * 0.7 * 0.6; // 70% of pre-retirement income, 60% from investments
      
      conservative = (conservative - withdrawalAmount) * 1.03; // 3% return
      moderate = (moderate - withdrawalAmount) * 1.04; // 4% return
      aggressive = (aggressive - withdrawalAmount) * 1.05; // 5% return
    }
    
    data.push({
      age,
      conservative: Math.max(0, conservative),
      moderate: Math.max(0, moderate),
      aggressive: Math.max(0, aggressive),
    });
  }
  
  return data;
}

function generateSocialSecurityData(inputs: CalculatorInputs): SocialSecurityDataPoint[] {
  const baseAmount = inputs.annualIncome * 0.4 / 12; // 40% of pre-retirement income, monthly
  
  return [
    { claimingAge: 62, monthlyBenefit: baseAmount * 0.7 }, // Early claiming penalty
    { claimingAge: 67, monthlyBenefit: baseAmount }, // Full retirement age
    { claimingAge: 70, monthlyBenefit: baseAmount * 1.24 }, // Delayed retirement credits
  ];
}
