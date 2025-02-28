
import { CalculatorInputs, RetirementPlan, NetWorthDataPoint, IncomeSourcesDataPoint, WithdrawalStrategyDataPoint, RiskProfileDataPoint, SocialSecurityDataPoint } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy = 90,
    annualIncome,
    incomeGrowthRate = 0.03,
    cashSavings,
    retirementAccounts,
    rothAccounts,
    taxableInvestments,
    realEstateEquity,
    annual401kContribution,
    annualRothContribution,
    annualTaxableContribution,
    investmentReturnRate = 0.07
  } = inputs;

  // Basic calculations
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Current total savings
  const currentTotalSavings = cashSavings + retirementAccounts + rothAccounts + taxableInvestments;
  
  // Annual total contributions
  const annualContributions = annual401kContribution + annualRothContribution + annualTaxableContribution;

  // Calculate future value more safely to avoid overflow
  // Future value of current savings
  let projectedSavings = currentTotalSavings;
  for (let i = 0; i < yearsToRetirement; i++) {
    projectedSavings = projectedSavings * (1 + investmentReturnRate);
    // Add annual contributions
    projectedSavings += annualContributions;
  }

  // Estimated annual retirement income (using 4% withdrawal rule)
  const estimatedAnnualRetirementIncome = projectedSavings * 0.04;

  // Sustainability score calculation (out of 100)
  // Higher score means more sustainable
  const withdrawalRate = 0.04; // 4% withdrawal rate
  
  // Adjust sustainability score based on withdrawals vs returns
  let sustainabilityScore = 75; // Default score
  
  // Increase score if retirement funds should last longer
  if (investmentReturnRate > withdrawalRate) {
    sustainabilityScore += 15;
  } else {
    sustainabilityScore -= 15;
  }
  
  // Adjust based on years in retirement
  if (yearsInRetirement > 30) {
    sustainabilityScore -= 10;
  } else if (yearsInRetirement < 20) {
    sustainabilityScore += 10;
  }
  
  // Final clamping
  sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));

  // Calculate success probability
  const successProbability = Math.min(100, Math.max(0, 
    investmentReturnRate > withdrawalRate ? 
      90 + (investmentReturnRate - withdrawalRate) * 100 : 
      80 - (withdrawalRate - investmentReturnRate) * 200
  ));

  // Calculate portfolio longevity
  // If investment return > withdrawal rate, funds can theoretically last forever
  let portfolioLongevity: number;
  if (investmentReturnRate > withdrawalRate) {
    portfolioLongevity = lifeExpectancy;
  } else {
    // Simplified calculation for when funds deplete
    // ln(1 - (withdrawal_rate * principal) / (annual_contribution * (1 + return_rate))) / ln(1 + return_rate)
    const depletion = Math.log(1 - (withdrawalRate * projectedSavings) / (annualContributions * (1 + investmentReturnRate))) / Math.log(1 + investmentReturnRate);
    
    // Convert to age
    portfolioLongevity = Math.min(lifeExpectancy, Math.max(retirementAge, Math.floor(retirementAge + depletion)));
  }

  // Generate recommendations
  const recommendations = [];
  if (sustainabilityScore < 60) {
    recommendations.push("Consider increasing your savings rate.");
    recommendations.push("Explore delaying retirement to increase your savings.");
  }
  if (annualContributions < annualIncome * 0.15) {
    recommendations.push("Aim to save at least 15% of your income for retirement.");
  }
  if (successProbability < 70) {
    recommendations.push("Consider more aggressive investment strategies to improve returns.");
  }
  if (portfolioLongevity < lifeExpectancy) {
    recommendations.push("Plan for a longer retirement horizon by increasing savings or reducing expenses.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Your retirement plan appears to be on track. Continue your current savings strategy.");
  }

  // Generate chart data
  const netWorthData = generateNetWorthData(inputs);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);
  
  // Return only properties defined in the RetirementPlan interface
  return {
    totalRetirementSavings: projectedSavings,
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
  
  let cash = inputs.cashSavings || 0;
  let retirement = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0);
  let taxable = inputs.taxableInvestments || 0;
  let realEstate = inputs.realEstateEquity || 0;
  
  // Use more realistic growth rates
  const cashGrowthRate = 0.02; // 2% for cash
  const retirementGrowthRate = inputs.investmentReturnRate || 0.07; // Default 7% for retirement accounts
  const taxableGrowthRate = (inputs.investmentReturnRate || 0.07) * 0.85; // Slightly lower due to taxes
  const realEstateGrowthRate = 0.04; // 4% for real estate
  
  // Annual contributions
  const retirementContribution = (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0);
  const taxableContribution = inputs.annualTaxableContribution || 0;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Simple growth model
    if (age < retirementAge) {
      // Pre-retirement growth with contributions
      cash = cash * (1 + cashGrowthRate) + (inputs.annualIncome || 0) * 0.03; // 3% of income to cash savings
      retirement = retirement * (1 + retirementGrowthRate) + retirementContribution;
      taxable = taxable * (1 + taxableGrowthRate) + taxableContribution;
      realEstate = realEstate * (1 + realEstateGrowthRate);
    } else {
      // Post-retirement growth and withdrawals
      const annualExpenses = (inputs.retirementAnnualSpending || (inputs.annualIncome || 0) * 0.7); // 70% of pre-retirement income
      const withdrawalNeeded = annualExpenses / 4; // Divide across accounts
      
      // Different growth rates in retirement (usually more conservative)
      cash = Math.max(0, cash * (1 + cashGrowthRate * 0.5) - withdrawalNeeded);
      retirement = Math.max(0, retirement * (1 + retirementGrowthRate * 0.8) - withdrawalNeeded);
      taxable = Math.max(0, taxable * (1 + taxableGrowthRate * 0.8) - withdrawalNeeded);
      realEstate = Math.max(0, realEstate * (1 + realEstateGrowthRate * 0.75) - withdrawalNeeded);
    }
    
    // Calculate total net worth
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
  const ssStartAge = inputs.ssStartAge || 67;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    let employment = 0;
    let socialSecurity = 0;
    let retirement = 0;
    let pension = 0;
    let rmd = 0;
    let taxable = 0;
    
    if (age < retirementAge) {
      // Pre-retirement: employment income with growth
      employment = (inputs.annualIncome || 0) * Math.pow(1 + (inputs.incomeGrowthRate || 0.03), age - currentAge);
    } else {
      // Post-retirement income sources
      
      // Social Security (starts at SS age)
      if (age >= ssStartAge) {
        socialSecurity = inputs.socialSecurityBenefit || ((inputs.annualIncome || 0) * 0.4); // 40% of pre-retirement income
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        pension = inputs.pensionAmount || 0;
      }
      
      // Retirement withdrawals based on spending needs
      const annualExpenses = inputs.retirementAnnualSpending || ((inputs.annualIncome || 0) * 0.7); // 70% of pre-retirement income
      const withdrawalNeeded = Math.max(0, annualExpenses - socialSecurity - pension);
      
      // After age 72, RMDs kick in
      if (age >= 72) {
        // Simplified RMD calculation
        const estimatedRetirementBalance = (inputs.retirementAccounts || 0) * Math.pow(1 + (inputs.investmentReturnRate || 0.07), retirementAge - currentAge);
        const rmdRate = 0.04 + (age - 72) * 0.001; // Increases with age
        rmd = Math.min(withdrawalNeeded, estimatedRetirementBalance * rmdRate);
        
        // Remaining withdrawals
        const remainingNeed = withdrawalNeeded - rmd;
        retirement = remainingNeed * 0.6;
        taxable = remainingNeed * 0.4;
      } else {
        // Before RMDs
        retirement = withdrawalNeeded * 0.6;
        taxable = withdrawalNeeded * 0.4;
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
  let estimatedRetirementSavings = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0);
  const annualContributions = (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0) + (inputs.annualTaxableContribution || 0);
  const yearsToRetirement = retirementAge - inputs.currentAge;
  const returnRate = inputs.investmentReturnRate || 0.07;
  
  // Calculate future value
  for (let i = 0; i < yearsToRetirement; i++) {
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + returnRate) + annualContributions;
  }
  
  // Initial balances for different withdrawal rates
  let conservativeBalance = estimatedRetirementSavings;
  let moderateBalance = estimatedRetirementSavings;
  let aggressiveBalance = estimatedRetirementSavings;
  
  // Withdrawal rates
  const conservativeRate = 0.03;
  const moderateRate = 0.04;
  const aggressiveRate = 0.05;
  
  // Growth rate in retirement (slightly lower than accumulation phase)
  const retirementGrowthRate = returnRate * 0.8;
  
  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    // Conservative: 3% withdrawal
    let conservativeWithdrawal = conservativeBalance * conservativeRate;
    conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * (1 + retirementGrowthRate));
    
    // Moderate: 4% withdrawal
    let moderateWithdrawal = moderateBalance * moderateRate;
    moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * (1 + retirementGrowthRate));
    
    // Aggressive: 5% withdrawal
    let aggressiveWithdrawal = aggressiveBalance * aggressiveRate;
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
  
  // Current total investments
  const totalInvestments = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0);
  const annualContributions = (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0) + (inputs.annualTaxableContribution || 0);
  
  // Initialize balances for different risk profiles
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  // Different return rates based on risk profile
  const conservativeReturnRate = 0.05; // 5% return
  const moderateReturnRate = 0.07; // 7% return
  const aggressiveReturnRate = 0.09; // 9% return
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    if (age < retirementAge) {
      // Pre-retirement: growth with contributions
      conservative = conservative * (1 + conservativeReturnRate) + annualContributions;
      moderate = moderate * (1 + moderateReturnRate) + annualContributions;
      aggressive = aggressive * (1 + aggressiveReturnRate) + annualContributions;
    } else {
      // Post-retirement: growth with withdrawals
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
  // Base monthly amount (either from inputs or estimated as 40% of pre-retirement income)
  const baseMonthlyAmount = (inputs.socialSecurityBenefit || ((inputs.annualIncome || 0) * 0.4 / 12)); 
  
  // Early, normal, and delayed claiming ages
  return [
    { claimingAge: 62, monthlyBenefit: baseMonthlyAmount * 0.7 }, // Early claiming penalty
    { claimingAge: 67, monthlyBenefit: baseMonthlyAmount }, // Full retirement age
    { claimingAge: 70, monthlyBenefit: baseMonthlyAmount * 1.24 }, // Delayed retirement credits
  ];
}
