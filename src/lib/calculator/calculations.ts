
import { CalculatorInputs, RetirementPlan } from "./types";

export function calculateRetirementPlan(inputs: CalculatorInputs): RetirementPlan {
  // This is a simplified calculation for demo purposes
  // In a real application, this would be much more detailed and accurate
  
  // Calculate years until retirement
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
  
  // Also consider spouse retirement timing if applicable
  const hasSpouse = inputs.spouseName.trim() !== "";
  const spouseYearsToRetirement = hasSpouse ? inputs.spouseRetirementAge - inputs.spouseAge : 0;
  const familyRetirementYear = Math.max(yearsToRetirement, spouseYearsToRetirement);
  
  // Calculate retirement savings
  let retirementSavings = inputs.retirementAccounts + inputs.rothAccounts;
  let taxableInvestments = inputs.taxableInvestments;
  let cashSavings = inputs.cashSavings;
  let realEstateEquity = inputs.realEstateEquity;
  
  // Account for annual contributions and growth
  for (let year = 0; year < yearsToRetirement; year++) {
    // Add annual contributions
    retirementSavings += inputs.annual401kContribution + inputs.annualRothContribution;
    taxableInvestments += inputs.annualTaxableContribution;
    
    // Apply investment returns
    retirementSavings *= (1 + inputs.investmentReturnRate / 100);
    taxableInvestments *= (1 + inputs.investmentReturnRate / 100);
    cashSavings *= (1 + (inputs.investmentReturnRate / 3) / 100); // Lower return on cash
    realEstateEquity *= (1 + (inputs.investmentReturnRate / 2) / 100); // Moderate growth for real estate
    
    // Account for inflation
    cashSavings /= (1 + inputs.inflationRate / 100);
  }
  
  const totalRetirementSavings = retirementSavings + taxableInvestments + cashSavings + realEstateEquity;
  
  // Calculate estimated retirement income
  const annualWithdrawal = totalRetirementSavings * (inputs.retirementWithdrawalRate / 100);
  const socialSecurityIncome = inputs.socialSecurityBenefit * 12;
  const spouseSocialSecurityIncome = hasSpouse ? inputs.spouseSocialSecurityBenefit * 12 : 0;
  const pensionIncome = inputs.hasPension ? inputs.pensionAmount : 0;
  
  const estimatedAnnualRetirementIncome = annualWithdrawal + socialSecurityIncome + spouseSocialSecurityIncome + pensionIncome;
  
  // Calculate sustainability metrics
  const incomeToExpenseRatio = estimatedAnnualRetirementIncome / inputs.retirementAnnualSpending;
  const sustainabilityScore = Math.min(100, Math.round(incomeToExpenseRatio * 80));
  
  const successProbability = calculateSuccessProbability(incomeToExpenseRatio, inputs.riskProfile, yearsInRetirement);
  
  // Calculate portfolio longevity
  const portfolioLongevity = calculatePortfolioLongevity(
    totalRetirementSavings,
    inputs.retirementAnnualSpending,
    inputs.investmentReturnRate,
    inputs.inflationRate,
    inputs.socialSecurityBenefit,
    hasSpouse ? inputs.spouseSocialSecurityBenefit : 0,
    inputs.hasPension ? inputs.pensionAmount : 0,
    inputs.retirementAge
  );
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    sustainabilityScore,
    inputs,
    estimatedAnnualRetirementIncome,
    portfolioLongevity
  );
  
  // Generate chart data
  const netWorthData = generateNetWorthData(inputs);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  
  return {
    totalRetirementSavings,
    estimatedAnnualRetirementIncome,
    sustainabilityScore,
    successProbability,
    portfolioLongevity,
    netWorthData,
    incomeSourcesData,
    socialSecurityData,
    withdrawalStrategyData,
    riskProfileData,
    recommendations
  };
}

function calculateSuccessProbability(
  incomeToExpenseRatio: number,
  riskProfile: string,
  yearsInRetirement: number
): number {
  // Simplified calculation for demo purposes
  let baseSuccess = incomeToExpenseRatio * 85;
  
  // Adjust based on risk profile
  if (riskProfile === "conservative") {
    baseSuccess = Math.min(baseSuccess * 1.1, 99); // More consistent but potentially lower returns
  } else if (riskProfile === "aggressive") {
    baseSuccess = baseSuccess * 0.95; // More variability in outcomes
  }
  
  // Adjust based on retirement duration
  if (yearsInRetirement > 30) {
    baseSuccess = baseSuccess * 0.9; // Longer timeframes introduce more uncertainty
  }
  
  return Math.round(Math.min(baseSuccess, 99));
}

function calculatePortfolioLongevity(
  totalSavings: number,
  annualSpending: number,
  investmentReturn: number,
  inflationRate: number,
  socialSecurityBenefit: number,
  spouseSocialSecurityBenefit: number,
  pensionAmount: number,
  retirementAge: number
): number {
  // Calculate real return (return minus inflation)
  const realReturn = (1 + investmentReturn / 100) / (1 + inflationRate / 100) - 1;
  
  // Annual income from other sources
  const otherAnnualIncome = (socialSecurityBenefit + spouseSocialSecurityBenefit) * 12 + pensionAmount;
  
  // Net annual withdrawal needed from portfolio
  const netAnnualWithdrawal = Math.max(0, annualSpending - otherAnnualIncome);
  
  if (netAnnualWithdrawal <= 0) {
    // If other income sources cover expenses, portfolio can last indefinitely
    return 99;
  }
  
  // Calculate withdrawal rate
  const withdrawalRate = netAnnualWithdrawal / totalSavings;
  
  // If withdrawal rate is less than real return, portfolio can last indefinitely
  if (withdrawalRate <= realReturn) {
    return 99;
  }
  
  // Simple calculation for estimating years the portfolio will last
  // ln(1 - (withdrawal rate / real return)) / ln(1 + real return)
  const portfolioYears = Math.log(1 - (withdrawalRate / realReturn)) / Math.log(1 + realReturn);
  
  // Determine age when portfolio is depleted
  return Math.min(99, Math.round(retirementAge + portfolioYears));
}

function generateRecommendations(
  sustainabilityScore: number,
  inputs: CalculatorInputs,
  estimatedIncome: number,
  portfolioLongevity: number
): string[] {
  const recommendations: string[] = [];
  const hasSpouse = inputs.spouseName.trim() !== "";
  
  // Always provide recommendations based on the sustainability score
  if (sustainabilityScore >= 80) {
    recommendations.push("Your retirement plan is well-funded. Consider optimizing your investment strategy to further reduce risk.");
    
    if (inputs.riskProfile === "aggressive" && inputs.retirementAge - inputs.currentAge < 10) {
      recommendations.push("As you approach retirement, consider shifting to a more conservative investment mix to protect your savings.");
    }
    
    // Add RMD recommendation for well-funded plans
    if (inputs.retirementAccounts > 0) {
      recommendations.push("Plan for Required Minimum Distributions (RMDs) from your traditional retirement accounts starting at age 73. Consider Roth conversions to minimize RMD tax impact.");
    }
  } else if (sustainabilityScore >= 60) {
    recommendations.push("Your retirement plan is on track but could benefit from some adjustments to improve sustainability.");
    
    // Recommend increased savings if there's a gap
    if (inputs.annual401kContribution < 20500) {
      recommendations.push("Consider increasing your 401(k) contributions to maximize tax advantages and boost retirement savings.");
    }
    
    // Add tax planning recommendation for RMDs
    if (inputs.retirementAccounts > 0) {
      recommendations.push("Develop a withdrawal strategy that balances tax efficiency with RMD requirements. Consider drawing from taxable accounts before age 73 to reduce future RMD tax impact.");
    }
  } else {
    recommendations.push("Your current retirement plan may not provide sufficient income. Consider these adjustments to improve sustainability:");
    
    // Recommend specific actions based on the biggest gaps
    recommendations.push("Increase your retirement contributions to build a larger nest egg.");
    
    if (inputs.retirementAge < 67) {
      recommendations.push("Consider delaying retirement by a few years to increase savings and Social Security benefits.");
    }
    
    if (inputs.retirementAnnualSpending > estimatedIncome * 0.8) {
      recommendations.push("Review your retirement budget to identify potential areas to reduce expenses.");
    }
  }
  
  // Spouse-specific recommendations
  if (hasSpouse) {
    const retirementAgeDifference = Math.abs(inputs.retirementAge - inputs.spouseRetirementAge);
    if (retirementAgeDifference > 3) {
      recommendations.push(`Consider the financial impact of a ${retirementAgeDifference}-year difference in retirement timing between you and your spouse.`);
    }
    
    if (inputs.spouseIncome > 0 && inputs.spouseSocialSecurityBenefit === 0) {
      recommendations.push("Estimate your spouse's Social Security benefits to get a more accurate retirement projection.");
    }
  }
  
  // Debt-related recommendations
  if (inputs.creditCardBalance > 0) {
    recommendations.push("Prioritize paying off high-interest credit card debt to improve your financial position.");
  }
  
  // Social Security optimization
  if (inputs.ssStartAge < 70) {
    recommendations.push("Consider delaying Social Security benefits until age 70 to maximize your lifetime benefits.");
  }
  
  // Portfolio longevity concerns
  if (portfolioLongevity < inputs.lifeExpectancy) {
    recommendations.push(`Your portfolio may be depleted by age ${portfolioLongevity}, before your expected life expectancy of ${inputs.lifeExpectancy}.`);
  }
  
  // Tax optimization
  if (inputs.rothAccounts < inputs.retirementAccounts * 0.3) {
    recommendations.push("Consider expanding your Roth investments to create tax diversification in retirement and reduce future RMD tax burdens.");
  }
  
  return recommendations;
}

function generateNetWorthData(inputs: CalculatorInputs) {
  const data = [];
  const hasSpouse = inputs.spouseName.trim() !== "";
  
  // Split retirement accounts into traditional and Roth for RMD calculations
  let traditionalRetirement = inputs.retirementAccounts;
  let rothRetirement = inputs.rothAccounts;
  let taxable = inputs.taxableInvestments;
  let cash = inputs.cashSavings;
  let realEstate = inputs.realEstateEquity;
  
  // Track annual contributions
  const annual401kContribution = inputs.annual401kContribution;
  const annualRothContribution = inputs.annualRothContribution;
  
  // Pre-retirement (using primary person's retirement age)
  for (let age = inputs.currentAge; age <= inputs.retirementAge; age++) {
    // Check if spouse is still working (additional income)
    const spouseAge = hasSpouse ? inputs.spouseAge + (age - inputs.currentAge) : 0;
    const spouseIsWorking = hasSpouse && spouseAge < inputs.spouseRetirementAge;
    
    // Add contributions
    traditionalRetirement += annual401kContribution;
    rothRetirement += annualRothContribution;
    taxable += inputs.annualTaxableContribution;
    
    // Apply returns
    cash *= (1 + (inputs.investmentReturnRate / 3) / 100);
    traditionalRetirement *= (1 + inputs.investmentReturnRate / 100);
    rothRetirement *= (1 + inputs.investmentReturnRate / 100);
    taxable *= (1 + inputs.investmentReturnRate / 100);
    realEstate *= (1 + (inputs.investmentReturnRate / 2) / 100);
    
    // Account for life events
    if (inputs.planningWedding && age === Math.floor(inputs.weddingYear - inputs.currentAge + inputs.currentAge)) {
      cash -= inputs.weddingCost;
      cash = Math.max(0, cash); // Prevent negative cash
    }
    
    if (inputs.planningHomePurchase && age === Math.floor(inputs.homePurchaseYear - inputs.currentAge + inputs.currentAge)) {
      cash -= inputs.homeDownPayment;
      cash = Math.max(0, cash); // Prevent negative cash
      realEstate += inputs.homeDownPayment;
    }
    
    // Combine retirement accounts for data display
    const totalRetirement = traditionalRetirement + rothRetirement;
    
    data.push({
      age,
      cash: Math.round(cash),
      retirement: Math.round(totalRetirement),
      taxable: Math.round(taxable),
      realEstate: Math.round(realEstate)
    });
  }
  
  // Post-retirement (20 years after retirement)
  const withdrawalRate = inputs.retirementWithdrawalRate / 100;
  const rmdStartAge = 73; // Current RMD start age (as of 2023 SECURE Act 2.0)
  
  for (let age = inputs.retirementAge + 1; age <= inputs.retirementAge + 20; age++) {
    // Calculate total portfolio value
    const totalPortfolioValue = cash + traditionalRetirement + rothRetirement + taxable;
    
    // Calculate income sources first
    const socialSecurityIncome = age >= inputs.ssStartAge ? (inputs.socialSecurityBenefit * 12) : 0;
    const spouseSocialSecurityIncome = hasSpouse && age >= inputs.ssStartAge ? (inputs.spouseSocialSecurityBenefit * 12) : 0;
    const pensionIncome = inputs.hasPension ? inputs.pensionAmount : 0;
    const fixedIncome = socialSecurityIncome + spouseSocialSecurityIncome + pensionIncome;
    
    // Calculate needed withdrawal from investments
    let neededWithdrawal = Math.max(0, inputs.retirementAnnualSpending - fixedIncome);
    
    // Calculate RMD if applicable
    let rmdAmount = 0;
    if (age >= rmdStartAge && traditionalRetirement > 0) {
      const rmdDivisor = getRMDDivisor(age);
      rmdAmount = traditionalRetirement / rmdDivisor;
    }
    
    // Determine withdrawal strategy based on RMDs and needs
    let traditionalWithdrawal = 0;
    let rothWithdrawal = 0;
    let taxableWithdrawal = 0;
    let cashWithdrawal = 0;
    
    // Always take RMD first if required
    if (rmdAmount > 0) {
      traditionalWithdrawal = rmdAmount;
      neededWithdrawal = Math.max(0, neededWithdrawal - rmdAmount);
    }
    
    // Then withdraw from taxable accounts
    if (neededWithdrawal > 0 && taxable > 0) {
      taxableWithdrawal = Math.min(neededWithdrawal, taxable);
      neededWithdrawal -= taxableWithdrawal;
    }
    
    // Then use cash
    if (neededWithdrawal > 0 && cash > 0) {
      cashWithdrawal = Math.min(neededWithdrawal, cash);
      neededWithdrawal -= cashWithdrawal;
    }
    
    // Then use additional traditional IRA funds if needed
    if (neededWithdrawal > 0 && traditionalRetirement > traditionalWithdrawal) {
      const additionalTraditionalWithdrawal = Math.min(neededWithdrawal, traditionalRetirement - traditionalWithdrawal);
      traditionalWithdrawal += additionalTraditionalWithdrawal;
      neededWithdrawal -= additionalTraditionalWithdrawal;
    }
    
    // Last, use Roth if still needed
    if (neededWithdrawal > 0 && rothRetirement > 0) {
      rothWithdrawal = Math.min(neededWithdrawal, rothRetirement);
      neededWithdrawal -= rothWithdrawal;
    }
    
    // Apply withdrawals
    traditionalRetirement -= traditionalWithdrawal;
    rothRetirement -= rothWithdrawal;
    taxable -= taxableWithdrawal;
    cash -= cashWithdrawal;
    
    // Apply growth to remaining balances
    traditionalRetirement *= (1 + inputs.investmentReturnRate / 100);
    rothRetirement *= (1 + inputs.investmentReturnRate / 100);
    taxable *= (1 + inputs.investmentReturnRate / 100);
    cash *= (1 + (inputs.investmentReturnRate / 3) / 100);
    realEstate *= (1 + (inputs.investmentReturnRate / 2) / 100);
    
    // Combine retirement accounts for data display
    const totalRetirement = traditionalRetirement + rothRetirement;
    
    data.push({
      age,
      cash: Math.max(0, Math.round(cash)),
      retirement: Math.max(0, Math.round(totalRetirement)),
      taxable: Math.max(0, Math.round(taxable)),
      realEstate: Math.round(realEstate)
    });
  }
  
  return data;
}

// RMD divisor table (simplified for demonstration)
function getRMDDivisor(age: number): number {
  const rmdTable: {[key: number]: number} = {
    73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2,
    81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7,
    89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4,
    97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4
  };
  
  // Use default divisor for ages not in table
  return rmdTable[age] || 20.0;
}

function generateIncomeSourcesData(inputs: CalculatorInputs) {
  const data = [];
  const hasSpouse = inputs.spouseName.trim() !== "";
  
  // Split retirement accounts for RMD calculations
  let traditionalRetirement = inputs.retirementAccounts;
  let rothRetirement = inputs.rothAccounts;
  let taxable = inputs.taxableInvestments;
  let employmentIncome = inputs.annualIncome;
  let spouseIncome = hasSpouse ? inputs.spouseIncome : 0;
  
  // Track annual contributions
  const annual401kContribution = inputs.annual401kContribution;
  const annualRothContribution = inputs.annualRothContribution;
  
  // Grow accounts during pre-retirement
  for (let year = 0; year < inputs.retirementAge - inputs.currentAge; year++) {
    traditionalRetirement += annual401kContribution;
    rothRetirement += annualRothContribution;
    taxable += inputs.annualTaxableContribution;
    
    traditionalRetirement *= (1 + inputs.investmentReturnRate / 100);
    rothRetirement *= (1 + inputs.investmentReturnRate / 100);
    taxable *= (1 + inputs.investmentReturnRate / 100);
    
    employmentIncome *= (1 + inputs.incomeGrowthRate / 100);
    if (hasSpouse) {
      spouseIncome *= (1 + inputs.spouseIncomeGrowthRate / 100);
    }
  }
  
  const rmdStartAge = 73;
  
  // Pre-retirement and retirement years
  for (let age = inputs.currentAge; age <= inputs.retirementAge + 30; age++) {
    // Calculate spouse's age in this year
    const spouseAge = hasSpouse ? inputs.spouseAge + (age - inputs.currentAge) : 0;
    
    // Determine employment income
    let currentEmploymentIncome = 0;
    let currentRetirementIncome = 0;
    let currentSocialSecurityIncome = 0;
    let currentRmdIncome = 0;
    
    // Employment income
    if (age < inputs.retirementAge) {
      currentEmploymentIncome += employmentIncome;
    }
    
    // Spouse's income if applicable
    if (hasSpouse && spouseAge < inputs.spouseRetirementAge) {
      currentEmploymentIncome += spouseIncome;
    }
    
    // Social security starts at SS start age
    if (age >= inputs.ssStartAge) {
      currentSocialSecurityIncome += inputs.socialSecurityBenefit * 12;
      
      if (hasSpouse && spouseAge >= inputs.ssStartAge) {
        currentSocialSecurityIncome += inputs.spouseSocialSecurityBenefit * 12;
      }
    }
    
    // Pension income
    const pensionIncome = inputs.hasPension && age >= inputs.retirementAge ? inputs.pensionAmount : 0;
    
    // For retirement years, calculate retirement withdrawals
    if (age >= inputs.retirementAge) {
      const fixedIncome = currentSocialSecurityIncome + pensionIncome;
      let neededIncome = inputs.retirementAnnualSpending - fixedIncome;
      
      // Handle RMDs first (shown separately)
      if (age >= rmdStartAge && traditionalRetirement > 0) {
        const rmdDivisor = getRMDDivisor(age);
        const rmdAmount = traditionalRetirement / rmdDivisor;
        currentRmdIncome = rmdAmount;
        
        // Reduce needed income by RMD amount
        neededIncome = Math.max(0, neededIncome - rmdAmount);
        
        // Update traditional retirement balance for next year
        traditionalRetirement -= rmdAmount;
      }
      
      // Additional retirement withdrawals (shown as retirement income)
      if (neededIncome > 0) {
        // First from taxable, then from traditional beyond RMD, then from Roth
        const withdrawalAmount = Math.min(neededIncome, taxable + traditionalRetirement + rothRetirement);
        currentRetirementIncome = withdrawalAmount;
        
        // This is simplified, in reality would track which accounts withdrawals come from
      }
    }
    
    data.push({
      age,
      employment: Math.max(0, Math.round(currentEmploymentIncome)),
      retirement: Math.max(0, Math.round(currentRetirementIncome)), 
      socialSecurity: Math.max(0, Math.round(currentSocialSecurityIncome)),
      pension: Math.max(0, Math.round(pensionIncome)),
      rmd: Math.max(0, Math.round(currentRmdIncome))
    });
    
    // Stop when sufficient retirement years have been modeled
    if (age >= inputs.retirementAge + 30 || age >= inputs.lifeExpectancy) {
      break;
    }
  }
  
  return data;
}

function calculateRetirementWithdrawal(inputs: CalculatorInputs, yearsInRetirement: number) {
  // Simple calculation for demo purposes
  const totalRetirementAssets = calculateTotalRetirementAssets(inputs);
  
  return totalRetirementAssets * (inputs.retirementWithdrawalRate / 100) * 
    Math.pow(1 - inputs.retirementWithdrawalRate / 200, yearsInRetirement); // Slowly decreasing withdrawals
}

function calculateTotalRetirementAssets(inputs: CalculatorInputs) {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  
  let retirementAccounts = inputs.retirementAccounts + inputs.rothAccounts;
  let taxableInvestments = inputs.taxableInvestments;
  
  // Account for annual contributions and growth
  for (let year = 0; year < yearsToRetirement; year++) {
    // Add annual contributions
    retirementAccounts += inputs.annual401kContribution + inputs.annualRothContribution;
    taxableInvestments += inputs.annualTaxableContribution;
    
    // Apply investment returns
    retirementAccounts *= (1 + inputs.investmentReturnRate / 100);
    taxableInvestments *= (1 + inputs.investmentReturnRate / 100);
  }
  
  return retirementAccounts + taxableInvestments;
}

function generateSocialSecurityData(inputs: CalculatorInputs) {
  // Base monthly benefit at full retirement age (67)
  const baseMonthlyBenefit = inputs.socialSecurityBenefit;
  
  // Calculate benefits at different ages
  const earlyBenefit = baseMonthlyBenefit * 0.7; // 30% reduction at age 62
  const fullBenefit = baseMonthlyBenefit;
  const delayedBenefit = baseMonthlyBenefit * 1.24; // 24% increase at age 70
  
  return [
    { claimingAge: 62, monthlyBenefit: Math.round(earlyBenefit) },
    { claimingAge: 67, monthlyBenefit: Math.round(fullBenefit) },
    { claimingAge: 70, monthlyBenefit: Math.round(delayedBenefit) }
  ];
}

function generateWithdrawalStrategyData(inputs: CalculatorInputs) {
  const data = [];
  
  // Calculate total portfolio value at retirement
  const totalRetirementAssets = calculateTotalRetirementAssets(inputs);
  
  // Split assets for more accurate RMD modeling
  const traditionalIRA = inputs.retirementAccounts * 
    Math.pow(1 + inputs.investmentReturnRate / 100, inputs.retirementAge - inputs.currentAge);
  const rothIRA = inputs.rothAccounts * 
    Math.pow(1 + inputs.investmentReturnRate / 100, inputs.retirementAge - inputs.currentAge);
  const taxableAssets = totalRetirementAssets - traditionalIRA - rothIRA;
  
  const rmdStartAge = 73;
  
  // Create data points for different withdrawal strategies
  for (let age = inputs.retirementAge; age <= inputs.lifeExpectancy; age++) {
    const yearsInRetirement = age - inputs.retirementAge;
    
    // For RMD-adjusted strategies, calculate RMD first then supplement with additional withdrawals
    let conservative = totalRetirementAssets * Math.pow(1.07 - 0.03, yearsInRetirement);
    let moderate = totalRetirementAssets * Math.pow(1.07 - 0.04, yearsInRetirement);
    let aggressive = totalRetirementAssets * Math.pow(1.07 - 0.05, yearsInRetirement);
    
    // Adjust for RMD impact - simplified illustration for the chart
    if (age >= rmdStartAge) {
      // Apply a small adjustment to show RMD impact on portfolio value
      const rmdImpact = 0.005 * (age - rmdStartAge + 1); // Increases with age
      conservative *= (1 - rmdImpact);
      moderate *= (1 - rmdImpact);
      aggressive *= (1 - rmdImpact);
    }
    
    data.push({
      age,
      conservative: Math.max(0, Math.round(conservative)),
      moderate: Math.max(0, Math.round(moderate)),
      aggressive: Math.max(0, Math.round(aggressive))
    });
  }
  
  return data;
}

function generateRiskProfileData(inputs: CalculatorInputs) {
  const data = [];
  
  // Calculate total current investments
  const totalCurrentInvestments = 
    inputs.retirementAccounts + 
    inputs.rothAccounts + 
    inputs.taxableInvestments;
  
  // Define returns for different risk profiles
  const conservativeReturn = 5.0;
  const moderateReturn = 7.0;
  const aggressiveReturn = 9.0;
  
  let conservativeValue = totalCurrentInvestments;
  let moderateValue = totalCurrentInvestments;
  let aggressiveValue = totalCurrentInvestments;
  
  // Annual contributions
  const annualContribution = 
    inputs.annual401kContribution + 
    inputs.annualRothContribution + 
    inputs.annualTaxableContribution;
  
  for (let age = inputs.currentAge; age <= inputs.currentAge + 30; age++) {
    // Add annual contributions (stop at retirement)
    if (age < inputs.retirementAge) {
      conservativeValue += annualContribution;
      moderateValue += annualContribution;
      aggressiveValue += annualContribution;
    }
    
    // Apply returns
    conservativeValue *= (1 + conservativeReturn / 100);
    moderateValue *= (1 + moderateReturn / 100);
    aggressiveValue *= (1 + aggressiveReturn / 100);
    
    // Every 5 years
    if ((age - inputs.currentAge) % 5 === 0 || age === inputs.retirementAge) {
      data.push({
        age,
        conservative: Math.round(conservativeValue),
        moderate: Math.round(moderateValue),
        aggressive: Math.round(aggressiveValue)
      });
    }
  }
  
  return data;
}
