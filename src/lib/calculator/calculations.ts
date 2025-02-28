
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
  // Future value of current savings with a more controlled calculation
  let projectedSavings = currentTotalSavings;
  
  // Cap the number of years for compound calculations to avoid overflow
  const safeYearsToRetirement = Math.min(yearsToRetirement, 80);
  
  // Use a safer iterative approach instead of exponential calculation
  for (let i = 0; i < safeYearsToRetirement; i++) {
    // Apply growth rate to current principal
    projectedSavings = projectedSavings * (1 + investmentReturnRate);
    
    // Add annual contributions
    projectedSavings += annualContributions;
    
    // Safety cap to prevent numeric overflow
    if (projectedSavings > 1e12) { // Cap at trillion dollar level
      projectedSavings = 1e12;
      break;
    }
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
  
  // Adjust based on savings ratio
  const savingsRatio = annualContributions / Math.max(1, annualIncome);
  if (savingsRatio > 0.15) {
    sustainabilityScore += 10;
  } else if (savingsRatio < 0.10) {
    sustainabilityScore -= 10;
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
    // Handle potential division by zero or very small values
    if (annualContributions <= 0 || projectedSavings <= 0) {
      portfolioLongevity = retirementAge; // Funds depleted immediately at retirement
    } else {
      try {
        // Simplified calculation for when funds deplete
        const numerator = Math.log(1 - (withdrawalRate * projectedSavings) / Math.max(1, (annualContributions * (1 + investmentReturnRate))));
        const denominator = Math.log(1 + investmentReturnRate);
        
        // Avoid division by zero
        if (denominator === 0) {
          portfolioLongevity = retirementAge;
        } else {
          const depletion = numerator / denominator;
          
          // Check for valid numeric result
          if (isNaN(depletion) || !isFinite(depletion)) {
            portfolioLongevity = lifeExpectancy;
          } else {
            // Convert to age
            portfolioLongevity = Math.min(lifeExpectancy, Math.max(retirementAge, Math.floor(retirementAge + depletion)));
          }
        }
      } catch (e) {
        // Fallback if calculation fails
        portfolioLongevity = Math.min(lifeExpectancy, retirementAge + 20);
      }
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

// Sample data generation functions with improved safety checks
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
  const retirementGrowthRate = Math.min(inputs.investmentReturnRate || 0.07, 0.12); // Cap at 12%
  const taxableGrowthRate = Math.min((inputs.investmentReturnRate || 0.07) * 0.85, 0.10); // Cap at 10%
  const realEstateGrowthRate = 0.04; // 4% for real estate
  
  // Annual contributions
  const retirementContribution = (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0);
  const taxableContribution = inputs.annualTaxableContribution || 0;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Cap values to prevent overflow
    cash = Math.min(cash, 1e12);
    retirement = Math.min(retirement, 1e12);
    taxable = Math.min(taxable, 1e12);
    realEstate = Math.min(realEstate, 1e12);
    
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
      const withdrawalNeeded = Math.min(annualExpenses / 4, 1e8); // Divide across accounts, cap withdrawal
      
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
      // Pre-retirement: employment income with growth (cap at 40 years to prevent overflow)
      const safeYears = Math.min(age - currentAge, 40);
      employment = (inputs.annualIncome || 0) * Math.pow(1 + Math.min(inputs.incomeGrowthRate || 0.03, 0.08), safeYears);
      employment = Math.min(employment, 1e7); // Cap at $10M to prevent overflow
    } else {
      // Post-retirement income sources
      
      // Social Security (starts at SS age)
      if (age >= ssStartAge) {
        socialSecurity = inputs.socialSecurityBenefit || Math.min((inputs.annualIncome || 0) * 0.4, 75000); // Cap at $75K
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        pension = Math.min(inputs.pensionAmount || 0, 200000); // Cap at $200K
      }
      
      // Retirement withdrawals based on spending needs
      const annualExpenses = Math.min(
        inputs.retirementAnnualSpending || ((inputs.annualIncome || 0) * 0.7), 
        500000
      ); // Cap at $500K
      const withdrawalNeeded = Math.max(0, annualExpenses - socialSecurity - pension);
      
      // After age 72, RMDs kick in
      if (age >= 72) {
        // Simplified RMD calculation
        const safeYears = Math.min(retirementAge - currentAge, 40);
        const estimatedRetirementBalance = Math.min(
          (inputs.retirementAccounts || 0) * Math.pow(1 + Math.min(inputs.investmentReturnRate || 0.07, 0.10), safeYears),
          1e8
        ); // Cap at $100M
        const rmdRate = 0.04 + Math.min((age - 72) * 0.001, 0.05); // Increases with age, cap at 9%
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
    
    // Apply safety caps to all values
    employment = Math.min(employment, 1e7);
    socialSecurity = Math.min(socialSecurity, 200000);
    retirement = Math.min(retirement, 1e7);
    pension = Math.min(pension, 300000);
    rmd = Math.min(rmd, 1e7);
    taxable = Math.min(taxable, 1e7);
    
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
  
  // Calculate projected retirement savings at retirement (safely)
  let estimatedRetirementSavings = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0);
  const annualContributions = (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0) + (inputs.annualTaxableContribution || 0);
  const yearsToRetirement = Math.min(retirementAge - inputs.currentAge, 80); // Cap at 80 years to prevent overflow
  const returnRate = Math.min(inputs.investmentReturnRate || 0.07, 0.12); // Cap at 12%
  
  // Calculate future value with safety checks
  for (let i = 0; i < yearsToRetirement; i++) {
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + returnRate) + annualContributions;
    
    // Safety cap
    if (estimatedRetirementSavings > 1e9) {
      estimatedRetirementSavings = 1e9; // Cap at $1B
      break;
    }
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
    // Safety caps
    conservativeBalance = Math.min(conservativeBalance, 1e10);
    moderateBalance = Math.min(moderateBalance, 1e10);
    aggressiveBalance = Math.min(aggressiveBalance, 1e10);
    
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
  const totalInvestments = Math.min(
    (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0),
    1e8 // Cap initial investments at $100M
  );
  const annualContributions = Math.min(
    (inputs.annual401kContribution || 0) + (inputs.annualRothContribution || 0) + (inputs.annualTaxableContribution || 0),
    1e6 // Cap annual contributions at $1M
  );
  
  // Initialize balances for different risk profiles
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  // Different return rates based on risk profile
  const conservativeReturnRate = 0.05; // 5% return
  const moderateReturnRate = 0.07; // 7% return
  const aggressiveReturnRate = 0.09; // 9% return
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Apply safety caps
    conservative = Math.min(conservative, 1e10);
    moderate = Math.min(moderate, 1e10);
    aggressive = Math.min(aggressive, 1e10);
    
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
  // Cap at reasonable maximum
  const baseMonthlyAmount = Math.min(
    (inputs.socialSecurityBenefit || ((inputs.annualIncome || 0) * 0.4 / 12)),
    10000 // Cap at $10K/month
  ); 
  
  // Early, normal, and delayed claiming ages
  return [
    { claimingAge: 62, monthlyBenefit: baseMonthlyAmount * 0.7 }, // Early claiming penalty
    { claimingAge: 67, monthlyBenefit: baseMonthlyAmount }, // Full retirement age
    { claimingAge: 70, monthlyBenefit: baseMonthlyAmount * 1.24 }, // Delayed retirement credits
  ];
}
