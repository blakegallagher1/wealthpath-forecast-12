
import { CalculatorInputs, RetirementPlan, NetWorthDataPoint, IncomeSourcesDataPoint, WithdrawalStrategyDataPoint, RiskProfileDataPoint, SocialSecurityDataPoint } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy = 90,
    annualIncome,
    incomeGrowthRate = 0.03,
    cashSavings = 0,
    retirementAccounts = 0,
    rothAccounts = 0,
    taxableInvestments = 0,
    realEstateEquity = 0,
    annual401kContribution = 0,
    annualRothContribution = 0,
    annualTaxableContribution = 0,
    investmentReturnRate = 0.07,
    mortgageBalance = 0
  } = inputs;

  // Basic calculations
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
  
  // Current total savings
  const currentTotalSavings = cashSavings + retirementAccounts + rothAccounts + taxableInvestments;
  
  // Annual total contributions
  const annualContributions = annual401kContribution + annualRothContribution + annualTaxableContribution;

  // Calculate future value with a more realistic approach
  let projectedSavings = currentTotalSavings;
  const safeReturnRate = Math.min(Math.max(0.01, investmentReturnRate), 0.12); // Cap between 1% and 12%
  
  // Safe iterative approach for compound calculations
  for (let i = 0; i < yearsToRetirement; i++) {
    // Apply growth rate to current principal
    projectedSavings = projectedSavings * (1 + safeReturnRate);
    
    // Add annual contributions
    projectedSavings += annualContributions;
    
    // Safety cap to prevent unrealistic values
    if (projectedSavings > 50000000) { // Cap at $50M
      projectedSavings = 50000000;
      break;
    }
  }

  // Estimated annual retirement income (using 4% withdrawal rule)
  const withdrawalRate = 0.04;
  const estimatedAnnualRetirementIncome = projectedSavings * withdrawalRate;

  // Sustainability score calculation (out of 100)
  let sustainabilityScore = 75; // Default score
  
  // Adjust score based on savings ratio
  const savingsRatio = annualContributions / Math.max(1, annualIncome);
  if (savingsRatio > 0.15) {
    sustainabilityScore += 10;
  } else if (savingsRatio < 0.10) {
    sustainabilityScore -= 10;
  }
  
  // Adjust score based on investment return rate vs withdrawal rate
  if (safeReturnRate > withdrawalRate + 0.02) {
    sustainabilityScore += 15; // Significantly higher returns than withdrawals
  } else if (safeReturnRate > withdrawalRate) {
    sustainabilityScore += 10; // Higher returns than withdrawals
  } else if (safeReturnRate < withdrawalRate - 0.01) {
    sustainabilityScore -= 15; // Lower returns than withdrawals
  }
  
  // Adjust based on years in retirement
  if (yearsInRetirement > 30) {
    sustainabilityScore -= 10; // Long retirement period increases risk
  } else if (yearsInRetirement < 20) {
    sustainabilityScore += 5; // Shorter retirement period reduces risk
  }
  
  // Final clamping
  sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));

  // Calculate success probability
  const successProbability = Math.min(100, Math.max(0, 
    safeReturnRate > withdrawalRate ? 
      80 + (safeReturnRate - withdrawalRate) * 400 : 
      70 - (withdrawalRate - safeReturnRate) * 500
  ));

  // Calculate portfolio longevity
  let portfolioLongevity: number;
  
  if (safeReturnRate > withdrawalRate) {
    portfolioLongevity = lifeExpectancy; // Theoretically sustainable indefinitely
  } else {
    try {
      // Simplified formula for when portfolio depletes
      // Using the formula: N = log(1 - r*P/PMT) / log(1+r) where:
      // N = number of years, r = return rate, P = principal, PMT = annual withdrawal
      const annualWithdrawal = estimatedAnnualRetirementIncome;
      const ratio = annualWithdrawal / (projectedSavings * safeReturnRate);
      
      if (ratio >= 1) {
        // Withdrawals exceed returns, use simplified formula
        const yearsOfRetirement = projectedSavings / annualWithdrawal;
        portfolioLongevity = Math.min(lifeExpectancy, retirementAge + Math.floor(yearsOfRetirement));
      } else {
        // Use more accurate formula for depletion
        const depletion = Math.log(1 - ratio) / Math.log(1 + safeReturnRate);
        
        if (isNaN(depletion) || !isFinite(depletion) || depletion < 0) {
          portfolioLongevity = lifeExpectancy; // Default to life expectancy if calculation fails
        } else {
          portfolioLongevity = Math.min(lifeExpectancy, retirementAge + Math.floor(depletion));
        }
      }
    } catch (e) {
      // Fallback if calculation fails
      portfolioLongevity = Math.min(lifeExpectancy, retirementAge + 20);
    }
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
    recommendations.push("Consider more conservative withdrawal rates in retirement.");
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

function generateNetWorthData(inputs: CalculatorInputs): NetWorthDataPoint[] {
  const data: NetWorthDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Starting values
  let cash = inputs.cashSavings || 0;
  let retirement = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0);
  let taxable = inputs.taxableInvestments || 0;
  let realEstate = inputs.realEstateEquity || 0;
  
  // Debt (subtract from net worth)
  let mortgageBalance = inputs.mortgageBalance || 0;
  let otherDebt = (inputs.creditCardBalance || 0) + (inputs.autoLoanBalance || 0) + (inputs.studentLoanBalance || 0);
  
  // Growth rates with realistic caps
  const cashGrowthRate = 0.02; // 2% for cash
  const retirementGrowthRate = Math.min(inputs.investmentReturnRate || 0.07, 0.10); // Cap at 10%
  const taxableGrowthRate = Math.min((inputs.investmentReturnRate || 0.07) * 0.85, 0.085); // Cap at 8.5% (lower due to taxes)
  const realEstateGrowthRate = 0.03; // 3% for real estate, more conservative
  
  // Annual contributions
  const retirementContribution = (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0);
  const taxableContribution = inputs.annualTaxableContribution || 0;
  
  // Retirement spending
  const retirementSpendingRate = 0.04; // 4% withdrawal rate
  
  // Mortgage paydown (assume 30-year mortgage)
  const mortgagePaymentYears = 30;
  const annualMortgagePaydown = mortgageBalance > 0 ? mortgageBalance / mortgagePaymentYears : 0;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Calculate year's net worth
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    // Apply mortgage paydown if still paying
    if (mortgageBalance > 0 && age < currentAge + mortgagePaymentYears) {
      mortgageBalance = Math.max(0, mortgageBalance - annualMortgagePaydown);
    } else {
      mortgageBalance = 0;
    }
    
    // Reduce other debt over time (10% per year)
    if (otherDebt > 0) {
      otherDebt = Math.max(0, otherDebt * 0.9);
    }
    
    // Apply growth rates with safety caps
    if (age < retirementAge) {
      // Pre-retirement: growth with contributions
      cash = Math.min(cash * (1 + cashGrowthRate) + (inputs.annualIncome || 0) * 0.03, 500000); // Cap cash at $500K
      retirement = Math.min(retirement * (1 + retirementGrowthRate) + retirementContribution, 10000000); // Cap at $10M
      taxable = Math.min(taxable * (1 + taxableGrowthRate) + taxableContribution, 10000000); // Cap at $10M
      realEstate = Math.min(realEstate * (1 + realEstateGrowthRate), 5000000); // Cap at $5M
    } else {
      // Post-retirement: withdrawals
      const totalAssets = cash + retirement + taxable + realEstate;
      const annualWithdrawal = Math.min(totalAssets * retirementSpendingRate, 500000); // Cap at $500K/year
      const withdrawalPerAccount = annualWithdrawal / 4; // Distribute across accounts
      
      // Reduce each account proportionally, but ensure we don't go negative
      cash = Math.max(0, cash * (1 + cashGrowthRate) - withdrawalPerAccount);
      retirement = Math.max(0, retirement * (1 + retirementGrowthRate * 0.9) - withdrawalPerAccount);
      taxable = Math.max(0, taxable * (1 + taxableGrowthRate * 0.9) - withdrawalPerAccount);
      realEstate = Math.max(0, realEstate * (1 + realEstateGrowthRate * 0.9) - withdrawalPerAccount);
    }
    
    // Calculate total net worth (assets minus debts)
    const total = cash + retirement + taxable + realEstate - mortgageBalance - otherDebt;
    
    // Add data point
    data.push({
      age,
      year,
      cash,
      retirement,
      taxable,
      realEstate,
      total,
      isRetirementAge
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
  
  // Income growth rate with realistic cap
  const incomeGrowthRate = Math.min(inputs.incomeGrowthRate || 0.03, 0.05); // Cap at 5%
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    let employment = 0;
    let socialSecurity = 0;
    let retirement = 0;
    let pension = 0;
    let rmd = 0;
    let taxable = 0;
    
    if (age < retirementAge) {
      // Pre-retirement: employment income with growth
      const yearsWorking = age - currentAge;
      employment = (inputs.annualIncome || 0) * Math.pow(1 + incomeGrowthRate, yearsWorking);
      employment = Math.min(employment, 500000); // Cap at $500K
      
      // Add spouse income if applicable
      if (inputs.spouseIncome && inputs.spouseIncome > 0 && inputs.spouseAge) {
        const spouseIncomeGrowthRate = Math.min(inputs.spouseIncomeGrowthRate || 0.03, 0.05);
        const spouseIncome = inputs.spouseIncome * Math.pow(1 + spouseIncomeGrowthRate, yearsWorking);
        employment += Math.min(spouseIncome, 500000);
      }
    } else {
      // Post-retirement income sources
      
      // Social Security (starts at SS age)
      if (age >= ssStartAge) {
        // Base Social Security on income, with reasonable min/max
        const baseSS = inputs.socialSecurityBenefit || Math.min(Math.max((inputs.annualIncome || 0) * 0.4, 15000), 50000);
        socialSecurity = Math.min(baseSS, 60000); // Cap at $60K
        
        // Add spouse SS if applicable
        if (inputs.spouseSocialSecurityBenefit && inputs.spouseSocialSecurityBenefit > 0) {
          socialSecurity += Math.min(inputs.spouseSocialSecurityBenefit, 50000);
        }
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        pension = Math.min(inputs.pensionAmount || 0, 150000); // Cap at $150K
      }
      
      // Calculate retirement withdrawals
      const totalAssets = 
        (inputs.retirementAccounts || 0) + 
        (inputs.rothAccounts || 0) + 
        (inputs.taxableInvestments || 0);
      
      // Project asset growth
      const growthYears = retirementAge - currentAge;
      const growthRate = Math.min(inputs.investmentReturnRate || 0.07, 0.09);
      const projectedAssets = totalAssets * Math.pow(1 + growthRate, growthYears);
      
      // Annual withdrawals (4% rule)
      const annualWithdrawal = Math.min(projectedAssets * 0.04, 500000); // Cap at $500K/year
      
      // Required Minimum Distributions after age 72
      if (age >= 72) {
        const rmdPercentage = 0.04 + (age - 72) * 0.001; // Increases with age
        rmd = Math.min(projectedAssets * rmdPercentage * 0.7, 200000); // Cap at $200K
        
        // Remaining withdrawals
        const remainingNeed = Math.max(0, annualWithdrawal - rmd - socialSecurity - pension);
        retirement = remainingNeed * 0.6;
        taxable = remainingNeed * 0.4;
      } else {
        // Before RMDs
        const withdrawalNeeded = Math.max(0, annualWithdrawal - socialSecurity - pension);
        retirement = withdrawalNeeded * 0.6;
        taxable = withdrawalNeeded * 0.4;
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

function generateWithdrawalStrategyData(inputs: CalculatorInputs): WithdrawalStrategyDataPoint[] {
  const data: WithdrawalStrategyDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Calculate projected retirement savings
  let estimatedRetirementSavings = (inputs.retirementAccounts || 0) + 
                                 (inputs.rothAccounts || 0) + 
                                 (inputs.taxableInvestments || 0);
  
  const annualContributions = (inputs.annual401kContribution || 0) + 
                            (inputs.annualRothContribution || 0) + 
                            (inputs.annualTaxableContribution || 0);
  
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const returnRate = Math.min(inputs.investmentReturnRate || 0.07, 0.09); // Cap at 9%
  
  // Project savings to retirement with a more conservative approach
  for (let i = 0; i < yearsToRetirement; i++) {
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + returnRate) + annualContributions;
    if (estimatedRetirementSavings > 10000000) { // Cap at $10M
      estimatedRetirementSavings = 10000000;
      break;
    }
  }
  
  // Cap estimated retirement savings
  estimatedRetirementSavings = Math.min(estimatedRetirementSavings, 10000000);
  
  // Withdrawal rates
  const conservativeRate = 0.03; // 3% withdrawal
  const moderateRate = 0.04;     // 4% withdrawal
  const aggressiveRate = 0.05;   // 5% withdrawal
  
  // Post-retirement investment return (lower than accumulation phase)
  const retirementGrowthRate = returnRate * 0.8;
  
  // Initial balances
  let conservativeBalance = estimatedRetirementSavings;
  let moderateBalance = estimatedRetirementSavings;
  let aggressiveBalance = estimatedRetirementSavings;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    if (age >= retirementAge) {
      // After retirement, calculate different withdrawal strategies
      
      // Conservative (3%) strategy
      const conservativeWithdrawal = conservativeBalance * conservativeRate;
      conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * (1 + retirementGrowthRate));
      
      // Moderate (4%) strategy
      const moderateWithdrawal = moderateBalance * moderateRate;
      moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * (1 + retirementGrowthRate));
      
      // Aggressive (5%) strategy
      const aggressiveWithdrawal = aggressiveBalance * aggressiveRate;
      aggressiveBalance = Math.max(0, (aggressiveBalance - aggressiveWithdrawal) * (1 + retirementGrowthRate));
    } else {
      // Before retirement, all strategies have the same growth
      conservativeBalance = conservativeBalance * (1 + returnRate) + annualContributions;
      moderateBalance = moderateBalance * (1 + returnRate) + annualContributions;
      aggressiveBalance = aggressiveBalance * (1 + returnRate) + annualContributions;
      
      // Apply safety caps
      conservativeBalance = Math.min(conservativeBalance, 10000000);
      moderateBalance = Math.min(moderateBalance, 10000000);
      aggressiveBalance = Math.min(aggressiveBalance, 10000000);
    }
    
    data.push({
      age,
      year,
      conservative: conservativeBalance,
      moderate: moderateBalance,
      aggressive: aggressiveBalance,
      isRetirementAge
    });
  }
  
  return data;
}

function generateRiskProfileData(inputs: CalculatorInputs): RiskProfileDataPoint[] {
  const data: RiskProfileDataPoint[] = [];
  const currentAge = inputs.currentAge;
  const retirementAge = inputs.retirementAge;
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Total current investments
  const totalInvestments = Math.min(
    (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0),
    10000000 // Cap at $10M
  );
  
  // Annual contributions
  const annualContributions = Math.min(
    (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0) + (inputs.annualTaxableContribution || 0),
    100000 // Cap at $100K/year
  );
  
  // Risk profiles with realistic return rates
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  // Return rates by risk profile
  const conservativeReturnRate = 0.05; // 5% return
  const moderateReturnRate = 0.07;     // 7% return
  const aggressiveReturnRate = 0.09;   // 9% return
  
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
    conservative = Math.min(conservative, 10000000);
    moderate = Math.min(moderate, 10000000);
    aggressive = Math.min(aggressive, 10000000);
    
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

function generateSocialSecurityData(inputs: CalculatorInputs): SocialSecurityDataPoint[] {
  // Base monthly amount (estimated based on income)
  const baseMonthlyBenefit = Math.min(
    (inputs.socialSecurityBenefit || ((inputs.annualIncome || 0) * 0.4)) / 12,
    4000 // Cap at $4K/month
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
