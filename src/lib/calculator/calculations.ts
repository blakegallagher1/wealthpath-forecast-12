<lov-code>
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
  
  // Calculate retirement savings with volatility modeling
  let retirementSavings = inputs.retirementAccounts + inputs.rothAccounts;
  let taxableInvestments = inputs.taxableInvestments;
  let cashSavings = inputs.cashSavings;
  let realEstateEquity = inputs.realEstateEquity;
  
  // Generate random market scenarios based on risk profile
  const marketScenarios = generateMarketScenarios(inputs.riskProfile, yearsToRetirement);
  
  // Account for annual contributions and growth with volatility
  for (let year = 0; year < yearsToRetirement; year++) {
    // Add annual contributions
    retirementSavings += inputs.annual401kContribution + inputs.annualRothContribution;
    taxableInvestments += inputs.annualTaxableContribution;
    
    // Apply investment returns with volatility based on the current year's market scenario
    const yearReturn = marketScenarios[year];
    retirementSavings *= (1 + yearReturn / 100);
    taxableInvestments *= (1 + yearReturn / 100);
    cashSavings *= (1 + (yearReturn / 3) / 100); // Lower return on cash
    realEstateEquity *= (1 + (yearReturn / 2) / 100); // Moderate growth for real estate
    
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
  
  // Calculate sustainability metrics with volatility considerations
  const incomeToExpenseRatio = estimatedAnnualRetirementIncome / inputs.retirementAnnualSpending;
  const sustainabilityScore = Math.min(100, Math.round(incomeToExpenseRatio * 80));
  
  // Calculate success probability with Monte Carlo simulation
  const successProbability = calculateSuccessProbabilityWithMonteCarlo(
    totalRetirementSavings, 
    inputs.retirementAnnualSpending,
    inputs.investmentReturnRate,
    inputs.inflationRate,
    inputs.riskProfile,
    yearsInRetirement
  );
  
  // Calculate portfolio longevity with volatility
  const portfolioLongevity = calculatePortfolioLongevityWithVolatility(
    totalRetirementSavings,
    inputs.retirementAnnualSpending,
    inputs.investmentReturnRate,
    inputs.inflationRate,
    inputs.socialSecurityBenefit,
    hasSpouse ? inputs.spouseSocialSecurityBenefit : 0,
    inputs.hasPension ? inputs.pensionAmount : 0,
    inputs.retirementAge,
    inputs.riskProfile
  );
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    sustainabilityScore,
    inputs,
    estimatedAnnualRetirementIncome,
    portfolioLongevity
  );
  
  // Generate chart data with volatility
  const netWorthData = generateNetWorthDataWithVolatility(inputs);
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

// Function to generate market scenarios based on risk profile
function generateMarketScenarios(riskProfile: string, years: number): number[] {
  const scenarios: number[] = [];
  
  // Define volatility parameters based on risk profile
  let meanReturn: number;
  let volatility: number;
  
  switch (riskProfile) {
    case "conservative":
      meanReturn = 5.0;
      volatility = 6.0;
      break;
    case "moderate":
      meanReturn = 7.0;
      volatility = 12.0;
      break;
    case "aggressive":
      meanReturn = 9.0;
      volatility = 18.0;
      break;
    default:
      meanReturn = 7.0;
      volatility = 12.0;
  }
  
  // Generate random returns for each year using a normal distribution approximation
  for (let year = 0; year < years; year++) {
    // Box-Muller transform to generate normally distributed random numbers
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Apply mean and volatility
    const annualReturn = meanReturn + z * volatility;
    
    // Add some mean reversion - extreme years tend to be followed by less extreme years
    if (year > 0) {
      const previousReturn = scenarios[year - 1];
      if (previousReturn < (meanReturn - volatility) && annualReturn < meanReturn) {
        // After a very bad year, nudge upward slightly to model mean reversion
        scenarios.push((annualReturn + meanReturn) / 2);
      } else if (previousReturn > (meanReturn + volatility) && annualReturn > meanReturn) {
        // After a very good year, nudge downward slightly to model mean reversion
        scenarios.push((annualReturn + meanReturn) / 2);
      } else {
        scenarios.push(annualReturn);
      }
    } else {
      scenarios.push(annualReturn);
    }
  }
  
  // Model recession periods - add at least one market downturn cycle 
  if (years > 10) {
    // Find a spot for a recession between years 3-7
    const recessionStart = 3 + Math.floor(Math.random() * 5);
    const recessionLength = 1 + Math.floor(Math.random() * 2); // 1-2 years
    
    for (let i = 0; i < recessionLength; i++) {
      if (recessionStart + i < years) {
        // Model a significant downturn (negative returns)
        scenarios[recessionStart + i] = -10 - Math.random() * 15; // -10% to -25%
      }
    }
    
    // Possibility of a second recession if the timeline is long enough
    if (years > 20) {
      const secondRecessionStart = recessionStart + 8 + Math.floor(Math.random() * 5);
      const secondRecessionLength = 1 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < secondRecessionLength; i++) {
        if (secondRecessionStart + i < years) {
          // Model a second significant downturn
          scenarios[secondRecessionStart + i] = -8 - Math.random() * 12; // -8% to -20%
        }
      }
    }
  }
  
  return scenarios;
}

// Monte Carlo simulation for success probability
function calculateSuccessProbabilityWithMonteCarlo(
  initialPortfolio: number,
  annualSpending: number,
  meanReturnRate: number,
  inflationRate: number,
  riskProfile: string,
  yearsInRetirement: number
): number {
  const simulationRuns = 1000;
  let successfulRuns = 0;
  
  // Define volatility based on risk profile
  let volatility: number;
  switch (riskProfile) {
    case "conservative":
      volatility = 6.0;
      break;
    case "moderate":
      volatility = 12.0;
      break;
    case "aggressive":
      volatility = 18.0;
      break;
    default:
      volatility = 12.0;
  }
  
  for (let run = 0; run < simulationRuns; run++) {
    let portfolioValue = initialPortfolio;
    let isSuccessful = true;
    
    for (let year = 0; year < yearsInRetirement; year++) {
      // Generate random return for this year
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const annualReturn = meanReturnRate + z * volatility;
      
      // Apply return and withdrawal
      portfolioValue = portfolioValue * (1 + annualReturn / 100);
      const inflationAdjustedSpending = annualSpending * Math.pow(1 + inflationRate / 100, year);
      portfolioValue -= inflationAdjustedSpending;
      
      // Check if portfolio is depleted
      if (portfolioValue <= 0) {
        isSuccessful = false;
        break;
      }
    }
    
    if (isSuccessful) {
      successfulRuns++;
    }
  }
  
  return Math.round((successfulRuns / simulationRuns) * 100);
}

function calculatePortfolioLongevityWithVolatility(
  totalSavings: number,
  annualSpending: number,
  investmentReturn: number,
  inflationRate: number,
  socialSecurityBenefit: number,
  spouseSocialSecurityBenefit: number,
  pensionAmount: number,
  retirementAge: number,
  riskProfile: string
): number {
  // Run multiple simulations and take the median outcome
  const simulationRuns = 500;
  const longevityResults: number[] = [];
  
  // Define volatility based on risk profile
  let volatility: number;
  switch (riskProfile) {
    case "conservative":
      volatility = 6.0;
      break;
    case "moderate":
      volatility = 12.0;
      break;
    case "aggressive":
      volatility = 18.0;
      break;
    default:
      volatility = 12.0;
  }
  
  // Annual income from other sources
  const otherAnnualIncome = (socialSecurityBenefit + spouseSocialSecurityBenefit) * 12 + pensionAmount;
  
  // Net annual withdrawal needed from portfolio
  const initialNetAnnualWithdrawal = Math.max(0, annualSpending - otherAnnualIncome);
  
  if (initialNetAnnualWithdrawal <= 0) {
    // If other income sources cover expenses, portfolio can last indefinitely
    return 99;
  }
  
  for (let run = 0; run < simulationRuns; run++) {
    let portfolioValue = totalSavings;
    let currentAge = retirementAge;
    let depleted = false;
    
    while (currentAge < 120 && !depleted) {
      // Generate random return for this year
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const annualReturn = investmentReturn + z * volatility;
      
      // Apply investment return
      portfolioValue = portfolioValue * (1 + annualReturn / 100);
      
      // Calculate inflation-adjusted withdrawal for this year
      const yearsInRetirement = currentAge - retirementAge;
      const inflationFactor = Math.pow(1 + inflationRate / 100, yearsInRetirement);
      const adjustedWithdrawal = initialNetAnnualWithdrawal * inflationFactor;
      
      // Withdraw money
      portfolioValue -= adjustedWithdrawal;
      
      // Check if portfolio is depleted
      if (portfolioValue <= 0) {
        depleted = true;
      } else {
        currentAge++;
      }
    }
    
    // Record the longevity result
    longevityResults.push(depleted ? currentAge : 99);
  }
  
  // Sort results and take the median
  longevityResults.sort((a, b) => a - b);
  const medianIndex = Math.floor(simulationRuns / 2);
  return longevityResults[medianIndex];
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
  
  // Tax optimization - focus on taxable account drawdown strategy
  if (inputs.retirementAccounts > 0) {
    recommendations.push("For optimal tax efficiency, plan to exhaust taxable investments before tapping retirement accounts, while preserving Roth accounts for as long as possible (except when RMDs are required).");
  }
  
  return recommendations;
}

function generateNetWorthDataWithVolatility(inputs: CalculatorInputs) {
  const data = [];
  const hasSpouse = inputs.spouseName.trim() !== "";
  
  // Generate market scenarios based on risk profile
  const preRetirementYears = inputs.retirementAge - inputs.currentAge;
  const postRetirementYears = 30; // Show 30 years into retirement
  const totalYears = preRetirementYears + postRetirementYears;
  const marketScenarios = generateMarketScenarios(inputs.riskProfile, totalYears);
  
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
    const yearIndex = age - inputs.currentAge;
    
    // Check if spouse is still working (additional income)
    const spouseAge = hasSpouse ? inputs.spouseAge + (age - inputs.currentAge) : 0;
    const spouseIsWorking = hasSpouse && spouseAge < inputs.spouseRetirementAge;
    
    // Add contributions
    traditionalRetirement += annual401kContribution;
    rothRetirement += annualRothContribution;
    taxable += inputs.annualTaxableContribution;
    
    // Get the return rate for this year from market scenarios
    const yearReturn = marketScenarios[yearIndex];
    
    // Apply returns with volatility
    cash *= (1 + (yearReturn / 3) / 100);
    traditionalRetirement *= (1 + yearReturn / 100);
    rothRetirement *= (1 + yearReturn / 100);
    taxable *= (1 + yearReturn / 100);
    realEstate *= (1 + (yearReturn / 2) / 100);
    
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
    const yearIndex = age - inputs.currentAge;
    
    // Get the return rate for this year from market scenarios
    const yearReturn = marketScenarios[yearIndex];
    
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
    
    // IMPROVED WITHDRAWAL STRATEGY:
    // Before RMD age, prioritize taxable accounts and preserve retirement accounts
    // After RMD age, use RMDs first, then taxable, then additional traditional, then Roth
    
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
    
    // If we're before RMD age, try to avoid touching retirement accounts unless absolutely necessary
    if (age < rmdStartAge) {
      // Only tap retirement accounts if taxable and cash are depleted
      if (neededWithdrawal > 0) {
        // Prefer traditional over Roth for early withdrawals
        if (traditionalRetirement > 0) {
          traditionalWithdrawal = Math.min(neededWithdrawal, traditionalRetirement);
          neededWithdrawal -= traditionalWithdrawal;
        }
        
        // Use Roth only as last resort
        if (neededWithdrawal > 0 && rothRetirement > 0) {
          rothWithdrawal = Math.min(neededWithdrawal, rothRetirement);
          neededWithdrawal -= rothWithdrawal;
        }
      }
    } else {
      // After RMD age, we continue with the normal withdrawal hierarchy after taking RMDs
      
      // Use additional traditional IRA funds if needed
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
    }
    
    // Apply withdrawals
    traditionalRetirement -= traditionalWithdrawal;
    rothRetirement -= rothWithdrawal;
    taxable -= taxableWithdrawal;
    cash -= cashWithdrawal;
    
    // Apply growth to remaining balances with volatility
    traditionalRetirement *= (1 + yearReturn / 100);
    rothRetirement *= (1 + yearReturn / 100);
    taxable *= (1 + yearReturn / 100);
    cash *= (1 + (yearReturn / 3) / 100);
    realEstate *= (1 + (yearReturn / 2) / 100);
    
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
  let cash = inputs.cashSavings;
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
    cash *= (1 + (inputs.investmentReturnRate / 3) / 100);
    
    employmentIncome *= (1 + inputs.incomeGrowthRate / 100);
    if (hasSpouse) {
      spouseIncome *= (1 + inputs.spouseIncomeGrowthRate / 100);
    }
  }
  
  const rmdStartAge = 73;
  
  // Pre-retirement and retirement years
  for (let age = inputs.currentAge; age <= Math.min(inputs.lifeExpectancy, inputs.retirementAge + 30); age++) {
    // Calculate spouse's age in this year
    const spouseAge = hasSpouse ? inputs.spouseAge + (age - inputs.currentAge) : 0;
    
    // Determine employment income
    let currentEmploymentIncome = 0;
    let currentRetirementIncome = 0;
    let currentTaxableIncome = 0;
    let currentSocialSecurityIncome = 0;
    let currentRmdIncome = 0;
    
    // Employment income
    if (age < inputs.retirementAge) {
      currentEmploymentIncome += employmentIncome;
      employmentIncome *= (1 + inputs.incomeGrowthRate / 100);
    }
    
    // Spouse's income if applicable
    if (hasSpouse && spouseAge < inputs.spouseRetirementAge) {
      currentEmploymentIncome += spouseIncome;
      spouseIncome *= (1 + inputs.spouseIncomeGrowthRate / 100);
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
    
    // For retirement years, calculate withdrawals
    if (age >= inputs.retirementAge) {
      const fixedIncome = currentSocialSecurityIncome + pensionIncome;
      let neededIncome = inputs.retirementAnnualSpending - fixedIncome;
      
      // RMDs first if applicable
      if (age >= rmdStartAge && traditionalRetirement > 0) {
        const rmdDivisor = getRMDDivisor(age);
        const rmdAmount = traditionalRetirement / rmdDivisor;
        currentRmdIncome = rmdAmount;
        
        // Reduce needed income by RMD amount
        neededIncome = Math.max(0, neededIncome - rmdAmount);
        
        // Update traditional retirement balance
        traditionalRetirement -= rmdAmount;
      }
      
      // IMPROVED WITHDRAWAL STRATEGY FOR VISUALIZATION:
      // Before RMD age, show income coming from taxable accounts first
      // After RMD age, show RMDs separately, then other sources
      
      // If additional income is needed, draw from appropriate sources based on age
      if (neededIncome > 0) {
        if (age < rmdStartAge) {
          // Before RMD age, prioritize taxable accounts
          if (taxable > 0) {
            const taxableWithdrawal = Math.min(neededIncome, taxable);
            currentTaxableIncome = taxableWithdrawal;
            neededIncome -= taxableWithdrawal;
            taxable -= taxableWithdrawal;
          }
          
          // Only use retirement accounts if necessary
          if (neededIncome > 0) {
            currentRetirementIncome = neededIncome;
            
            // For accounting, we'd withdraw from traditional first
            if (traditionalRetirement > 0) {
              const traditionalWithdrawal = Math.min(neededIncome, traditionalRetirement);
              traditionalRetirement -= traditionalWithdrawal;
              neededIncome -= traditionalWithdrawal;
            }
            
            // Then from Roth if still needed
            if (neededIncome > 0 && rothRetirement > 0) {
              const rothWithdrawal = Math.min(neededIncome, rothRetirement);
              rothRetirement -= rothWithdrawal;
            }
          }
        } else {
          // After RMD age, continue with taxable, then additional traditional, then Roth
          if (taxable > 0) {
            const taxableWithdrawal = Math.min(neededIncome, taxable);
            currentTaxableIncome = taxableWithdrawal;
            neededIncome -= taxableWithdrawal;
            taxable -= taxableWithdrawal;
          }
          
          if (neededIncome > 0) {
            currentRetirementIncome = neededIncome;
            
            // For accounting, we'd withdraw from remaining traditional first
            if (traditionalRetirement > 0) {
              const traditionalWithdrawal = Math.min(neededIncome, traditionalRetirement);
              traditionalRetirement -= traditionalWithdrawal;
              neededIncome -= traditionalWithdrawal;
            }
            
            // Then from Roth if still needed
            if (neededIncome > 0 && rothRetirement > 0) {
              const rothWithdrawal = Math.min(neededIncome, rothRetirement);
              rothRetirement -= rothWithdrawal;
            }
          }
        }
      }
      
      // Apply growth to remaining balances
      traditionalRetirement *= (1 + inputs.investmentReturnRate / 100);
      rothRetirement *= (1 + inputs.investmentReturnRate / 100);
      taxable *= (1 + inputs.investmentReturnRate / 100);
      cash *= (1 + (inputs.investmentReturnRate / 3) / 100);
    }
    
    data.push({
      age,
      employment: Math.max(0, Math.round(currentEmploymentIncome)),
      retirement: Math.max(0, Math.round(currentRetirementIncome)),
      taxable: Math.max(0, Math.round(currentTaxableIncome)),
      socialSecurity: Math.max(0, Math.round(currentSocialSecurityIncome)),
      pension: Math.max(0, Math.round(pensionIncome)),
