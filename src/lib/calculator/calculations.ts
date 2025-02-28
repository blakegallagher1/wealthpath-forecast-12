
import { CalculatorInputs, RetirementPlan, NetWorthDataPoint, IncomeSourcesDataPoint, WithdrawalStrategyDataPoint, RiskProfileDataPoint, SocialSecurityDataPoint } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy = 90,
    annualIncome,
    incomeGrowthRate = 0.03,
    spouseIncome = 0,
    spouseIncomeGrowthRate = 0.03,
    spouseAge = 0,
    spouseRetirementAge = 0,
    expensePercentOfIncome = 70,
    retirementAnnualSpending,
    cashSavings = 0,
    retirementAccounts = 0,
    rothAccounts = 0,
    taxableInvestments = 0,
    realEstateEquity = 0,
    annual401kContribution = 0,
    annualRothContribution = 0,
    annualTaxableContribution = 0,
    investmentReturnRate = 0.07,
    hasPension = false,
    pensionAmount = 0,
    mortgageBalance = 0,
    mortgageInterestRate = 0.04,
    studentLoanBalance = 0,
    studentLoanInterestRate = 0.05,
    autoLoanBalance = 0,
    autoLoanInterestRate = 0.035,
    creditCardBalance = 0,
    creditCardInterestRate = 0.18,
    inflationRate = 0.025,
    socialSecurityBenefit = 0,
    spouseSocialSecurityBenefit = 0,
    ssStartAge = 67
  } = inputs;

  // Basic calculations
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
  
  // Adjust rates for inflation
  const realInvestmentReturn = (1 + investmentReturnRate) / (1 + inflationRate) - 1;
  const realIncomeGrowthRate = (1 + incomeGrowthRate) / (1 + inflationRate) - 1;
  const realSpouseIncomeGrowthRate = (1 + spouseIncomeGrowthRate) / (1 + inflationRate) - 1;
  
  // Current total savings
  const currentTotalSavings = cashSavings + retirementAccounts + rothAccounts + taxableInvestments;
  
  // Annual total contributions
  const annualContributions = annual401kContribution + annualRothContribution + annualTaxableContribution;

  // Project retirement savings
  let projectedSavings = currentTotalSavings;
  const safeReturnRate = Math.min(Math.max(0.01, realInvestmentReturn), 0.08); // Cap between 1% and 8% (real return)
  
  for (let i = 0; i < yearsToRetirement; i++) {
    // Apply growth rate to current principal
    projectedSavings = projectedSavings * (1 + safeReturnRate);
    
    // Add annual contributions (with employer match estimate if 401k contributions are present)
    const employerMatch = annual401kContribution > 0 ? Math.min(annual401kContribution * 0.5, annualIncome * 0.03) : 0; // Estimate 50% match up to 3% of income
    projectedSavings += annualContributions + employerMatch;
    
    // Safety cap to prevent unrealistic values
    if (projectedSavings > 20000000) { // Cap at $20M
      projectedSavings = 20000000;
      break;
    }
  }

  // Determine realistic retirement spending if not specified
  const calculatedRetirementSpending = retirementAnnualSpending || (annualIncome * (expensePercentOfIncome / 100));
  
  // Estimated annual retirement income (using the 4% rule as starting point)
  const withdrawalRate = 0.04; // Standard 4% rule
  // Adjust withdrawal rate based on retirement duration
  const adjustedWithdrawalRate = yearsInRetirement > 30 ? 0.035 : (yearsInRetirement < 20 ? 0.045 : withdrawalRate);
  
  // Calculate retirement income
  const portfolioIncome = projectedSavings * adjustedWithdrawalRate;
  
  // Social Security income
  const ssAge = Math.max(ssStartAge, retirementAge);
  const yearsUntilSS = Math.max(0, ssAge - retirementAge);
  let annualSocialSecurity = 0;
  
  // Estimate Social Security if not provided
  const estimatedSS = socialSecurityBenefit || Math.min(Math.max((annualIncome * 0.4), 18000), 40000);
  const estimatedSpouseSS = spouseSocialSecurityBenefit || (spouseIncome > 0 ? Math.min(Math.max((spouseIncome * 0.4), 18000), 40000) : 0);
  
  if (retirementAge >= ssStartAge) {
    annualSocialSecurity = estimatedSS + estimatedSpouseSS;
  } else {
    // Social Security starts later in retirement
    annualSocialSecurity = 0; // Will be factored in income sources data
  }
  
  // Pension income if applicable
  const annualPension = hasPension ? pensionAmount : 0;
  
  // Total estimated retirement income
  const estimatedAnnualRetirementIncome = portfolioIncome + annualSocialSecurity + annualPension;

  // Sustainability score calculation (out of 100)
  let sustainabilityScore = 60; // Starting score
  
  // Adjust score based on savings ratio
  const savingsRatio = annualContributions / Math.max(1, annualIncome);
  if (savingsRatio > 0.15) {
    sustainabilityScore += 15;
  } else if (savingsRatio > 0.10) {
    sustainabilityScore += 10;
  } else if (savingsRatio < 0.05) {
    sustainabilityScore -= 15;
  } else if (savingsRatio < 0.10) {
    sustainabilityScore -= 5;
  }
  
  // Adjust score based on investment return rate vs withdrawal rate
  if (safeReturnRate > adjustedWithdrawalRate + 0.02) {
    sustainabilityScore += 10; // Significantly higher returns than withdrawals
  } else if (safeReturnRate > adjustedWithdrawalRate) {
    sustainabilityScore += 5; // Higher returns than withdrawals
  } else if (safeReturnRate < adjustedWithdrawalRate - 0.01) {
    sustainabilityScore -= 10; // Lower returns than withdrawals
  }
  
  // Adjust based on years in retirement
  if (yearsInRetirement > 30) {
    sustainabilityScore -= 10; // Long retirement period increases risk
  } else if (yearsInRetirement < 20) {
    sustainabilityScore += 5; // Shorter retirement period reduces risk
  }
  
  // Adjust based on debt levels
  const totalDebt = mortgageBalance + studentLoanBalance + autoLoanBalance + creditCardBalance;
  const debtToIncomeRatio = totalDebt / Math.max(1, annualIncome);
  
  if (debtToIncomeRatio > 5) {
    sustainabilityScore -= 15; // Very high debt load
  } else if (debtToIncomeRatio > 3) {
    sustainabilityScore -= 10; // High debt load
  } else if (debtToIncomeRatio < 1) {
    sustainabilityScore += 5; // Low debt load
  }
  
  // Adjust based on retirement income replacement ratio
  const incomeReplacementRatio = estimatedAnnualRetirementIncome / Math.max(1, (annualIncome + spouseIncome));
  
  if (incomeReplacementRatio > 0.8) {
    sustainabilityScore += 10; // Excellent income replacement
  } else if (incomeReplacementRatio > 0.6) {
    sustainabilityScore += 5; // Good income replacement
  } else if (incomeReplacementRatio < 0.4) {
    sustainabilityScore -= 10; // Poor income replacement
  }
  
  // Final clamping
  sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));

  // Calculate success probability
  let successProbability = 0;
  
  if (safeReturnRate > adjustedWithdrawalRate) {
    // Higher chance of success when returns exceed withdrawal rate
    const buffer = safeReturnRate - adjustedWithdrawalRate;
    successProbability = 70 + (buffer * 500); // 500 is a scaling factor
  } else {
    // Lower chance when withdrawals exceed returns
    const deficit = adjustedWithdrawalRate - safeReturnRate;
    successProbability = 70 - (deficit * 700); // 700 is a scaling factor
  }
  
  // Adjust success probability based on savings ratio
  if (savingsRatio > 0.15) {
    successProbability += 10;
  } else if (savingsRatio < 0.05) {
    successProbability -= 10;
  }
  
  // Adjust based on non-portfolio income (Social Security, pension)
  const nonPortfolioIncomeRatio = (annualSocialSecurity + annualPension) / Math.max(1, estimatedAnnualRetirementIncome);
  
  if (nonPortfolioIncomeRatio > 0.5) {
    successProbability += 10; // Less reliance on portfolio withdrawals
  } else if (nonPortfolioIncomeRatio < 0.2) {
    successProbability -= 5; // Heavy reliance on portfolio withdrawals
  }
  
  // Final clamping
  successProbability = Math.max(0, Math.min(100, successProbability));

  // Calculate portfolio longevity
  let portfolioLongevity = lifeExpectancy; // Default assumption
  
  if (safeReturnRate < adjustedWithdrawalRate) {
    // Portfolio will deplete if withdrawal rate exceeds return rate
    try {
      // Use the present value of an annuity formula to calculate depletion
      const depletionYears = Math.log(1 - (adjustedWithdrawalRate / safeReturnRate)) / Math.log(1 + safeReturnRate);
      
      if (isFinite(depletionYears) && depletionYears > 0) {
        portfolioLongevity = Math.min(lifeExpectancy, retirementAge + Math.floor(depletionYears));
      }
    } catch (e) {
      // Fallback if calculation fails
      const simpleEstimate = projectedSavings / (Math.max(1, estimatedAnnualRetirementIncome - annualSocialSecurity - annualPension));
      portfolioLongevity = Math.min(lifeExpectancy, retirementAge + Math.floor(simpleEstimate));
    }
  }

  // Generate recommendations
  const recommendations = [];
  if (sustainabilityScore < 50) {
    recommendations.push("Your retirement plan needs significant improvement. Consider increasing your savings rate and delaying retirement.");
  } else if (sustainabilityScore < 70) {
    recommendations.push("Consider increasing your savings rate to improve retirement security.");
  }
  
  if (annualContributions < annualIncome * 0.15) {
    recommendations.push("Aim to save at least 15% of your income for retirement.");
  }
  
  if (successProbability < 70) {
    recommendations.push("Consider a more conservative withdrawal strategy in retirement.");
  }
  
  if (portfolioLongevity < lifeExpectancy) {
    recommendations.push("Your portfolio may not last through retirement. Consider increasing savings or reducing planned expenses.");
  }
  
  if (debtToIncomeRatio > 3) {
    recommendations.push("Your debt level is high relative to your income. Focus on reducing debt before retirement.");
  }
  
  if (creditCardBalance > 0) {
    recommendations.push("Prioritize paying off high-interest credit card debt before increasing retirement contributions.");
  }
  
  if (realInvestmentReturn < 0.04 && investmentReturnRate < 0.06) {
    recommendations.push("Consider a more growth-oriented investment strategy to improve returns.");
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
  const inflationRate = inputs.inflationRate || 0.025;
  
  // Starting values
  let cash = inputs.cashSavings || 0;
  let retirement = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0);
  let taxable = inputs.taxableInvestments || 0;
  let realEstate = inputs.realEstateEquity || 0;
  
  // Debt values
  let mortgageBalance = inputs.mortgageBalance || 0;
  let studentLoanBalance = inputs.studentLoanBalance || 0;
  let autoLoanBalance = inputs.autoLoanBalance || 0;
  let creditCardBalance = inputs.creditCardBalance || 0;
  
  // Calculate total debt
  let totalDebt = mortgageBalance + studentLoanBalance + autoLoanBalance + creditCardBalance;
  
  // Growth rates adjusted for inflation
  const realCashGrowthRate = 0.005; // 0.5% real return for cash (higher than inflation)
  const realRetirementGrowthRate = Math.min((inputs.investmentReturnRate || 0.07) - inflationRate, 0.06); // Cap at 6% real return
  const realTaxableGrowthRate = Math.min(((inputs.investmentReturnRate || 0.07) - 0.015) - inflationRate, 0.05); // Lower due to taxes, cap at 5% real return
  const realEstateGrowthRate = 0.01; // 1% real growth (conservative)
  
  // Annual contributions
  const annual401k = inputs.annual401kContribution || 0;
  const annualRoth = inputs.annualRothContribution || 0;
  const annualTaxable = inputs.annualTaxableContribution || 0;
  
  // Estimated employer match for 401k
  const employerMatch = annual401k > 0 ? Math.min(annual401k * 0.5, (inputs.annualIncome || 0) * 0.03) : 0;
  
  // Total annual retirement contributions including match
  const retirementContribution = annual401k + annualRoth + employerMatch;
  
  // Retirement spending (inflation adjusted)
  const spendingRate = inputs.retirementWithdrawalRate || 0.04;
  
  // Loan repayment calculations
  // Mortgage: assume 30-year term
  const mortgageYears = 30;
  const mortgageMonthlyRate = (inputs.mortgageInterestRate || 0.04) / 12;
  let mortgageMonthlyPayment = 0;
  
  if (mortgageBalance > 0 && mortgageMonthlyRate > 0) {
    mortgageMonthlyPayment = mortgageBalance * (mortgageMonthlyRate * Math.pow(1 + mortgageMonthlyRate, mortgageYears * 12)) / 
                             (Math.pow(1 + mortgageMonthlyRate, mortgageYears * 12) - 1);
  }
  
  const mortgageAnnualPayment = mortgageMonthlyPayment * 12;
  
  // Student loan: assume 10-year term
  const studentLoanYears = 10;
  const studentLoanMonthlyRate = (inputs.studentLoanInterestRate || 0.05) / 12;
  let studentLoanMonthlyPayment = 0;
  
  if (studentLoanBalance > 0 && studentLoanMonthlyRate > 0) {
    studentLoanMonthlyPayment = studentLoanBalance * (studentLoanMonthlyRate * Math.pow(1 + studentLoanMonthlyRate, studentLoanYears * 12)) / 
                               (Math.pow(1 + studentLoanMonthlyRate, studentLoanYears * 12) - 1);
  }
  
  const studentLoanAnnualPayment = studentLoanMonthlyPayment * 12;
  
  // Auto loan: assume 5-year term
  const autoLoanYears = 5;
  const autoLoanMonthlyRate = (inputs.autoLoanInterestRate || 0.035) / 12;
  let autoLoanMonthlyPayment = 0;
  
  if (autoLoanBalance > 0 && autoLoanMonthlyRate > 0) {
    autoLoanMonthlyPayment = autoLoanBalance * (autoLoanMonthlyRate * Math.pow(1 + autoLoanMonthlyRate, autoLoanYears * 12)) / 
                            (Math.pow(1 + autoLoanMonthlyRate, autoLoanYears * 12) - 1);
  }
  
  const autoLoanAnnualPayment = autoLoanMonthlyPayment * 12;
  
  // Credit card: assume minimum payment of 3% of balance
  const creditCardMinPayment = creditCardBalance * 0.03;
  const creditCardAnnualPayment = creditCardMinPayment * 12;
  
  // Income
  let annualIncome = inputs.annualIncome || 0;
  let spouseIncome = inputs.spouseIncome || 0;
  const incomeGrowthRate = Math.min(inputs.incomeGrowthRate || 0.03, 0.05); // Cap at 5%
  const spouseIncomeGrowthRate = Math.min(inputs.spouseIncomeGrowthRate || 0.03, 0.05);
  const spouseAge = inputs.spouseAge || 0;
  const spouseRetirementAge = inputs.spouseRetirementAge || 0;
  
  // Social Security
  const ssStartAge = inputs.ssStartAge || 67;
  const socialSecurityBenefit = inputs.socialSecurityBenefit || Math.min(Math.max((annualIncome * 0.4), 18000), 40000);
  const spouseSocialSecurityBenefit = inputs.spouseSocialSecurityBenefit || 
                                  (spouseIncome > 0 ? Math.min(Math.max((spouseIncome * 0.4), 18000), 40000) : 0);
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    // Calculate current year
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    // Determine if this is spouse's retirement year
    const isSpouseRetirementYear = spouseAge > 0 && (currentAge + (age - currentAge)) === spouseRetirementAge;
    
    // Income/expense calculations
    let currentIncome = 0;
    let currentExpenses = 0;
    
    if (age < retirementAge) {
      // Pre-retirement income with growth
      const yearsWorking = age - currentAge;
      currentIncome = annualIncome * Math.pow(1 + incomeGrowthRate, yearsWorking);
      
      // Add spouse income if working
      if (spouseIncome > 0 && spouseAge > 0) {
        const spouseYearsWorking = yearsWorking;
        const spouseCurrentAge = spouseAge + yearsWorking;
        
        if (spouseCurrentAge < spouseRetirementAge) {
          currentIncome += spouseIncome * Math.pow(1 + spouseIncomeGrowthRate, spouseYearsWorking);
        }
      }
      
      // Living expenses (pre-retirement)
      const expenseRatio = inputs.expensePercentOfIncome / 100 || 0.7; // Default to 70% of income
      currentExpenses = currentIncome * expenseRatio;
      
      // Add debt payments
      currentExpenses += mortgageAnnualPayment + studentLoanAnnualPayment + autoLoanAnnualPayment + creditCardAnnualPayment;
      
      // Available for savings or additional investments (after expenses and contributions)
      const availableForSavings = currentIncome - currentExpenses - retirementContribution - annualTaxable;
      
      // Add some to cash savings (up to 3 months expenses as emergency fund)
      const targetEmergencyFund = currentExpenses * 0.25; // 3 months
      if (cash < targetEmergencyFund) {
        const additionalCash = Math.min(availableForSavings * 0.5, targetEmergencyFund - cash);
        cash += additionalCash;
      }
    } else {
      // Post-retirement income
      // Social Security (if eligible by age)
      if (age >= ssStartAge) {
        currentIncome += socialSecurityBenefit;
        
        // Add spouse SS if applicable and spouse is eligible
        if (spouseAge > 0 && (spouseAge + (age - currentAge)) >= ssStartAge) {
          currentIncome += spouseSocialSecurityBenefit;
        }
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        currentIncome += inputs.pensionAmount || 0;
      }
      
      // Portfolio withdrawals
      const totalPortfolio = retirement + taxable;
      const withdrawalAmount = totalPortfolio * spendingRate;
      
      // Add withdrawal to income
      currentIncome += withdrawalAmount;
      
      // Reduce retirement accounts by withdrawal
      // Proportionally withdraw from different accounts
      const retirementRatio = retirement / Math.max(1, totalPortfolio);
      const taxableRatio = taxable / Math.max(1, totalPortfolio);
      
      retirement -= withdrawalAmount * retirementRatio;
      taxable -= withdrawalAmount * taxableRatio;
      
      // Living expenses (in retirement)
      currentExpenses = inputs.retirementAnnualSpending || (annualIncome * 0.7); // Default to 70% of pre-retirement income
      
      // Add remaining debt payments
      currentExpenses += mortgageAnnualPayment + studentLoanAnnualPayment + autoLoanAnnualPayment + creditCardAnnualPayment;
    }
    
    // Update debt balances
    // Mortgage payment breakdown (principal vs interest)
    if (mortgageBalance > 0) {
      const annualInterest = mortgageBalance * (inputs.mortgageInterestRate || 0.04);
      const principalPayment = Math.min(mortgageBalance, mortgageAnnualPayment - annualInterest);
      mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
      
      // If mortgage is fully paid, stop payments
      if (mortgageBalance === 0) {
        mortgageAnnualPayment = 0;
      }
    }
    
    // Student loan payment breakdown
    if (studentLoanBalance > 0) {
      const annualInterest = studentLoanBalance * (inputs.studentLoanInterestRate || 0.05);
      const principalPayment = Math.min(studentLoanBalance, studentLoanAnnualPayment - annualInterest);
      studentLoanBalance = Math.max(0, studentLoanBalance - principalPayment);
      
      // If loan is fully paid, stop payments
      if (studentLoanBalance === 0) {
        studentLoanAnnualPayment = 0;
      }
    }
    
    // Auto loan payment breakdown
    if (autoLoanBalance > 0) {
      const annualInterest = autoLoanBalance * (inputs.autoLoanInterestRate || 0.035);
      const principalPayment = Math.min(autoLoanBalance, autoLoanAnnualPayment - annualInterest);
      autoLoanBalance = Math.max(0, autoLoanBalance - principalPayment);
      
      // If loan is fully paid, stop payments
      if (autoLoanBalance === 0) {
        autoLoanAnnualPayment = 0;
      }
      
      // After 5 years, replace with a new car loan (realistic scenario)
      if (age >= currentAge + 5 && (age - currentAge) % 5 === 0 && age < retirementAge) {
        // New car every 5 years before retirement
        autoLoanBalance = (inputs.autoLoanBalance || 0) * Math.pow(1 + inflationRate, age - currentAge); // Adjusted for inflation
        
        // Recalculate payment
        const newAutoLoanMonthlyRate = (inputs.autoLoanInterestRate || 0.035) / 12;
        if (autoLoanBalance > 0 && newAutoLoanMonthlyRate > 0) {
          autoLoanMonthlyPayment = autoLoanBalance * (newAutoLoanMonthlyRate * Math.pow(1 + newAutoLoanMonthlyRate, autoLoanYears * 12)) / 
                                  (Math.pow(1 + newAutoLoanMonthlyRate, autoLoanYears * 12) - 1);
        }
        autoLoanAnnualPayment = autoLoanMonthlyPayment * 12;
      }
    }
    
    // Credit card payment breakdown
    if (creditCardBalance > 0) {
      const annualInterest = creditCardBalance * (inputs.creditCardInterestRate || 0.18);
      
      // Assume aggressive paydown of credit card debt
      const affordablePayment = Math.max(creditCardAnnualPayment, (currentIncome - currentExpenses) * 0.2);
      const principalPayment = Math.min(creditCardBalance, affordablePayment - annualInterest);
      
      creditCardBalance = Math.max(0, creditCardBalance - principalPayment);
      
      // If balance is zero, stop payments
      if (creditCardBalance === 0) {
        creditCardAnnualPayment = 0;
      }
    }
    
    // Update total debt
    totalDebt = mortgageBalance + studentLoanBalance + autoLoanBalance + creditCardBalance;
    
    // Apply growth rates to investments
    cash *= (1 + realCashGrowthRate);
    retirement *= (1 + realRetirementGrowthRate);
    taxable *= (1 + realTaxableGrowthRate);
    realEstate *= (1 + realEstateGrowthRate);
    
    // Add contributions if pre-retirement
    if (age < retirementAge) {
      // Add retirement contributions
      retirement += retirementContribution;
      
      // Add taxable contributions
      taxable += annualTaxable;
      
      // Add to real estate (assumes principal paydown increases equity)
      if (mortgageBalance > 0) {
        realEstate += mortgageAnnualPayment - (mortgageBalance * (inputs.mortgageInterestRate || 0.04));
      }
    }
    
    // Safety caps to prevent unrealistic values
    cash = Math.min(cash, 1000000); // Cap at $1M
    retirement = Math.min(retirement, 10000000); // Cap at $10M
    taxable = Math.min(taxable, 10000000); // Cap at $10M
    realEstate = Math.min(realEstate, 5000000); // Cap at $5M
    
    // Ensure non-negative values
    cash = Math.max(0, cash);
    retirement = Math.max(0, retirement);
    taxable = Math.max(0, taxable);
    realEstate = Math.max(0, realEstate);
    
    // Calculate total net worth (assets minus debts)
    const total = cash + retirement + taxable + realEstate - totalDebt;
    
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
  const inflationRate = inputs.inflationRate || 0.025;
  
  // Income growth rates (real rates)
  const realIncomeGrowthRate = Math.min((inputs.incomeGrowthRate || 0.03) - inflationRate, 0.02); // Cap at 2% real growth
  const realSpouseIncomeGrowthRate = Math.min((inputs.spouseIncomeGrowthRate || 0.03) - inflationRate, 0.02);
  
  // Spouse information
  const spouseAge = inputs.spouseAge || 0;
  const spouseRetirementAge = inputs.spouseRetirementAge || 0;
  let spouseIncome = inputs.spouseIncome || 0;
  
  // Investment returns (real rates)
  const realInvestmentReturn = Math.min((inputs.investmentReturnRate || 0.07) - inflationRate, 0.05); // Cap at 5% real return
  
  // Starting values
  let annualIncome = inputs.annualIncome || 0;
  
  // Calculate Social Security if not provided
  const socialSecurityBenefit = inputs.socialSecurityBenefit || 
                              Math.min(Math.max((annualIncome * 0.4), 18000), 40000);
  
  const spouseSocialSecurityBenefit = inputs.spouseSocialSecurityBenefit || 
                                    (spouseIncome > 0 ? Math.min(Math.max((spouseIncome * 0.4), 18000), 40000) : 0);
  
  // Retirement account projections
  // First, calculate projected retirement account balance at retirement
  let retirementAccounts = (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0);
  let taxableInvestments = inputs.taxableInvestments || 0;
  
  // Annual contributions
  const annual401k = inputs.annual401kContribution || 0;
  const annualRoth = inputs.annualRothContribution || 0;
  const annualTaxable = inputs.annualTaxableContribution || 0;
  
  // Projected employer match for 401k
  const employerMatch = annual401k > 0 ? Math.min(annual401k * 0.5, annualIncome * 0.03) : 0;
  
  // Total retirement contributions
  const totalRetirementContribution = annual401k + annualRoth + employerMatch;
  
  // Project accounts to retirement
  for (let i = 0; i < retirementAge - currentAge; i++) {
    retirementAccounts = retirementAccounts * (1 + realInvestmentReturn) + totalRetirementContribution;
    taxableInvestments = taxableInvestments * (1 + realInvestmentReturn * 0.85) + annualTaxable; // Tax drag on taxable accounts
  }
  
  // Ensure projected accounts are reasonable
  retirementAccounts = Math.min(retirementAccounts, 10000000);
  taxableInvestments = Math.min(taxableInvestments, 10000000);
  
  // Withdraw rate
  const withdrawRate = inputs.retirementWithdrawalRate || 0.04;
  
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
      employment = annualIncome * Math.pow(1 + realIncomeGrowthRate, yearsWorking);
      
      // Add spouse income if applicable and spouse is still working
      if (spouseIncome > 0 && spouseAge > 0) {
        const spouseCurrentAge = spouseAge + (age - currentAge);
        if (spouseCurrentAge < spouseRetirementAge) {
          employment += spouseIncome * Math.pow(1 + realSpouseIncomeGrowthRate, yearsWorking);
        } else if (spouseCurrentAge >= spouseRetirementAge && spouseCurrentAge >= ssStartAge) {
          // Spouse retired and getting Social Security
          socialSecurity += spouseSocialSecurityBenefit;
        }
      }
    } else {
      // Post-retirement income sources
      
      // Social Security (starts at SS age)
      if (age >= ssStartAge) {
        socialSecurity += socialSecurityBenefit;
        
        // Add spouse SS if applicable and eligible
        if (spouseAge > 0 && (spouseAge + (age - currentAge)) >= ssStartAge) {
          socialSecurity += spouseSocialSecurityBenefit;
        }
      }
      
      // Pension income if applicable
      if (inputs.hasPension) {
        pension = inputs.pensionAmount || 0;
      }
      
      // Calculate Required Minimum Distributions (RMDs) after age 72
      if (age >= 72) {
        // RMD percentage increases with age
        const rmdPercentage = 1 / Math.max(1, (90 - age)); // Simplified RMD calculation
        const rmdAmount = retirementAccounts * rmdPercentage;
        
        rmd = rmdAmount;
        retirementAccounts -= rmdAmount;
      } else {
        // Regular retirement withdrawals before RMDs
        const retirementWithdrawal = retirementAccounts * withdrawRate / 2; // Split between retirement and taxable
        retirement = retirementWithdrawal;
        retirementAccounts -= retirementWithdrawal;
      }
      
      // Taxable account withdrawals
      const taxableWithdrawal = taxableInvestments * withdrawRate / 2;
      taxable = taxableWithdrawal;
      taxableInvestments -= taxableWithdrawal;
      
      // Continue growing remaining balances
      retirementAccounts *= (1 + realInvestmentReturn);
      taxableInvestments *= (1 + realInvestmentReturn * 0.85);
    }
    
    // Ensure non-negative values
    employment = Math.max(0, employment);
    socialSecurity = Math.max(0, socialSecurity);
    retirement = Math.max(0, retirement);
    pension = Math.max(0, pension);
    rmd = Math.max(0, rmd);
    taxable = Math.max(0, taxable);
    
    // Calculate total income
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
  const inflationRate = inputs.inflationRate || 0.025;
  
  // Calculate projected retirement savings
  let estimatedRetirementSavings = (inputs.retirementAccounts || 0) + 
                                 (inputs.rothAccounts || 0) + 
                                 (inputs.taxableInvestments || 0);
  
  const annualContributions = (inputs.annual401kContribution || 0) + 
                            (inputs.annualRothContribution || 0) + 
                            (inputs.annualTaxableContribution || 0);
  
  // Employer match
  const annual401k = inputs.annual401kContribution || 0;
  const employerMatch = annual401k > 0 ? Math.min(annual401k * 0.5, (inputs.annualIncome || 0) * 0.03) : 0;
  const totalContributions = annualContributions + employerMatch;
  
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const returnRate = Math.min(inputs.investmentReturnRate || 0.07, 0.09); // Cap at 9%
  const realReturnRate = returnRate - inflationRate;
  
  // Project savings to retirement
  for (let i = 0; i < yearsToRetirement; i++) {
    estimatedRetirementSavings = estimatedRetirementSavings * (1 + returnRate) + totalContributions;
  }
  
  // Cap estimated retirement savings at a reasonable amount
  estimatedRetirementSavings = Math.min(estimatedRetirementSavings, 10000000);
  
  // Withdrawal rates (real rates, after inflation)
  const conservativeRate = 0.03; // 3% withdrawal
  const moderateRate = 0.04;     // 4% withdrawal
  const aggressiveRate = 0.05;   // 5% withdrawal
  
  // Return rates for different strategies (real rates)
  const conservativeReturnRate = Math.max(realReturnRate - 0.01, 0.02); // Lower risk, lower return
  const moderateReturnRate = realReturnRate;                          // Baseline return
  const aggressiveReturnRate = Math.min(realReturnRate + 0.01, 0.07); // Higher risk, higher return
  
  // Initial balances
  let conservativeBalance = estimatedRetirementSavings;
  let moderateBalance = estimatedRetirementSavings;
  let aggressiveBalance = estimatedRetirementSavings;
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    if (age < retirementAge) {
      // Pre-retirement growth (accumulation phase)
      conservativeBalance = conservativeBalance * (1 + conservativeReturnRate) + totalContributions;
      moderateBalance = moderateBalance * (1 + moderateReturnRate) + totalContributions;
      aggressiveBalance = aggressiveBalance * (1 + aggressiveReturnRate) + totalContributions;
    } else {
      // Post-retirement (withdrawal phase)
      
      // Additional income sources reduce required withdrawals
      let additionalIncome = 0;
      
      // Social Security (if eligible)
      if (age >= (inputs.ssStartAge || 67)) {
        additionalIncome += inputs.socialSecurityBenefit || 0;
        additionalIncome += inputs.spouseSocialSecurityBenefit || 0;
      }
      
      // Pension income
      if (inputs.hasPension) {
        additionalIncome += inputs.pensionAmount || 0;
      }
      
      // Target retirement spending
      const targetSpending = inputs.retirementAnnualSpending || (inputs.annualIncome * 0.7);
      
      // Required withdrawals (after considering other income)
      const requiredWithdrawal = Math.max(0, targetSpending - additionalIncome);
      
      // Calculate withdrawals for each strategy
      const conservativeWithdrawal = Math.min(conservativeBalance * conservativeRate, requiredWithdrawal);
      const moderateWithdrawal = Math.min(moderateBalance * moderateRate, requiredWithdrawal);
      const aggressiveWithdrawal = Math.min(aggressiveBalance * aggressiveRate, requiredWithdrawal);
      
      // Update balances after withdrawals and growth
      conservativeBalance = Math.max(0, (conservativeBalance - conservativeWithdrawal) * (1 + conservativeReturnRate));
      moderateBalance = Math.max(0, (moderateBalance - moderateWithdrawal) * (1 + moderateReturnRate));
      aggressiveBalance = Math.max(0, (aggressiveBalance - aggressiveWithdrawal) * (1 + aggressiveReturnRate));
    }
    
    // Apply safety caps to prevent unrealistic values
    conservativeBalance = Math.min(conservativeBalance, 15000000);
    moderateBalance = Math.min(moderateBalance, 15000000);
    aggressiveBalance = Math.min(aggressiveBalance, 15000000);
    
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
  const inflationRate = inputs.inflationRate || 0.025;
  
  // Total current investments
  const totalInvestments = Math.min(
    (inputs.retirementAccounts || 0) + (inputs.rothAccounts || 0) + (inputs.taxableInvestments || 0),
    10000000 // Cap at $10M
  );
  
  // Annual contributions
  const annual401k = inputs.annual401kContribution || 0;
  const annualRoth = inputs.annualRothContribution || 0;
  const annualTaxable = inputs.annualTaxableContribution || 0;
  const annualContributions = annual401k + annualRoth + annualTaxable;
  
  // Employer match
  const employerMatch = annual401k > 0 ? Math.min(annual401k * 0.5, (inputs.annualIncome || 0) * 0.03) : 0;
  const totalContributions = annualContributions + employerMatch;
  
  // Risk profiles with realistic return rates (real returns after inflation)
  let conservative = totalInvestments;
  let moderate = totalInvestments;
  let aggressive = totalInvestments;
  
  // Return rates by risk profile (real rates)
  const conservativeReturnRate = 0.03; // 3% real return (low risk)
  const moderateReturnRate = 0.05;     // 5% real return (moderate risk)
  const aggressiveReturnRate = 0.07;   // 7% real return (high risk)
  
  // Asset allocations by age and risk profile
  const getConservativeAllocation = (age: number, retAge: number) => {
    // Conservative allocation with higher bond percentage
    const yearsToRetirement = Math.max(0, retAge - age);
    const equityPercentage = Math.min(40, Math.max(20, yearsToRetirement * 2));
    return {
      equity: equityPercentage / 100,
      bonds: (100 - equityPercentage - 10) / 100,
      cash: 0.1  // 10% cash
    };
  };
  
  const getModerateAllocation = (age: number, retAge: number) => {
    // Moderate allocation following age-based rule
    const yearsToRetirement = Math.max(0, retAge - age);
    const equityPercentage = Math.min(80, Math.max(40, yearsToRetirement * 2));
    return {
      equity: equityPercentage / 100,
      bonds: (100 - equityPercentage - 5) / 100,
      cash: 0.05  // 5% cash
    };
  };
  
  const getAggressiveAllocation = (age: number, retAge: number) => {
    // Aggressive allocation with higher equity percentage
    const yearsToRetirement = Math.max(0, retAge - age);
    const equityPercentage = Math.min(90, Math.max(60, yearsToRetirement * 2));
    return {
      equity: equityPercentage / 100,
      bonds: (100 - equityPercentage - 2) / 100,
      cash: 0.02  // 2% cash
    };
  };
  
  // Withdrawal rate in retirement
  const withdrawalRate = inputs.retirementWithdrawalRate || 0.04;
  
  // Return rates for different asset classes (real returns)
  const equityReturn = 0.07;  // 7% real return
  const bondReturn = 0.02;    // 2% real return
  const cashReturn = 0.005;   // 0.5% real return
  
  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetirementAge = age === retirementAge;
    
    // Get asset allocations based on age
    const conservativeAlloc = getConservativeAllocation(age, retirementAge);
    const moderateAlloc = getModerateAllocation(age, retirementAge);
    const aggressiveAlloc = getAggressiveAllocation(age, retirementAge);
    
    // Calculate weighted returns based on asset allocation
    const conservativeWeightedReturn = 
      (conservativeAlloc.equity * equityReturn) + 
      (conservativeAlloc.bonds * bondReturn) + 
      (conservativeAlloc.cash * cashReturn);
    
    const moderateWeightedReturn = 
      (moderateAlloc.equity * equityReturn) + 
      (moderateAlloc.bonds * bondReturn) + 
      (moderateAlloc.cash * cashReturn);
    
    const aggressiveWeightedReturn = 
      (aggressiveAlloc.equity * equityReturn) + 
      (aggressiveAlloc.bonds * bondReturn) + 
      (aggressiveAlloc.cash * cashReturn);
    
    if (age < retirementAge) {
      // Pre-retirement growth with contributions
      conservative = conservative * (1 + conservativeWeightedReturn) + totalContributions;
      moderate = moderate * (1 + moderateWeightedReturn) + totalContributions;
      aggressive = aggressive * (1 + aggressiveWeightedReturn) + totalContributions;
    } else {
      // Post-retirement with withdrawals
      // Add Social Security and other income sources
      let additionalIncome = 0;
      
      if (age >= (inputs.ssStartAge || 67)) {
        additionalIncome += inputs.socialSecurityBenefit || 0;
        additionalIncome += inputs.spouseSocialSecurityBenefit || 0;
      }
      
      if (inputs.hasPension) {
        additionalIncome += inputs.pensionAmount || 0;
      }
      
      // Target retirement spending
      const targetSpending = inputs.retirementAnnualSpending || ((inputs.annualIncome || 0) * 0.7);
      
      // Required withdrawals after other income
      const requiredWithdrawal = Math.max(0, targetSpending - additionalIncome);
      
      // Calculate withdrawals for each portfolio (either the withdrawal rate or the required amount, whichever is less)
      const conservativeWithdrawal = Math.min(conservative * withdrawalRate, requiredWithdrawal);
      const moderateWithdrawal = Math.min(moderate * withdrawalRate, requiredWithdrawal);
      const aggressiveWithdrawal = Math.min(aggressive * withdrawalRate, requiredWithdrawal);
      
      // Apply withdrawals and growth
      conservative = Math.max(0, (conservative - conservativeWithdrawal) * (1 + conservativeWeightedReturn));
      moderate = Math.max(0, (moderate - moderateWithdrawal) * (1 + moderateWeightedReturn));
      aggressive = Math.max(0, (aggressive - aggressiveWithdrawal) * (1 + aggressiveWeightedReturn));
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
  // Calculate based on income if not provided
  const annualIncome = inputs.annualIncome || 0;
  let baseSocialSecurity = inputs.socialSecurityBenefit || 0;
  
  if (baseSocialSecurity === 0 && annualIncome > 0) {
    // Estimate Social Security based on income with realistic caps
    if (annualIncome < 20000) {
      baseSocialSecurity = annualIncome * 0.45; // Higher replacement rate for low incomes
    } else if (annualIncome < 50000) {
      baseSocialSecurity = 9000 + (annualIncome - 20000) * 0.35;
    } else if (annualIncome < 100000) {
      baseSocialSecurity = 19500 + (annualIncome - 50000) * 0.25;
    } else if (annualIncome < 150000) {
      baseSocialSecurity = 32000 + (annualIncome - 100000) * 0.15;
    } else {
      baseSocialSecurity = 39500 + (annualIncome - 150000) * 0.05;
    }
    
    // Cap at maximum Social Security benefit
    baseSocialSecurity = Math.min(baseSocialSecurity, 40000);
  }
  
  // Life expectancy
  const lifeExpectancy = inputs.lifeExpectancy || 90;
  
  // Calculate benefits at different claiming ages
  const earlyClaimingAge = 62;
  const fullRetirementAge = 67; // Full retirement age for most current workers
  const lateClaimingAge = 70;
  
  // Reduction/increase factors
  const earlyClaimingReduction = 0.70; // 30% reduction at age 62
  const lateClaimingIncrease = 1.24;  // 24% increase at age 70
  
  // Monthly benefits
  const monthlyAtFullRetirement = baseSocialSecurity / 12;
  const monthlyAtEarlyClaiming = monthlyAtFullRetirement * earlyClaimingReduction;
  const monthlyAtLateClaiming = monthlyAtFullRetirement * lateClaimingIncrease;
  
  // Calculate lifetime totals
  const yearsCollectingIfClaimEarly = Math.max(0, lifeExpectancy - earlyClaimingAge);
  const yearsCollectingIfClaimNormal = Math.max(0, lifeExpectancy - fullRetirementAge);
  const yearsCollectingIfClaimLate = Math.max(0, lifeExpectancy - lateClaimingAge);
  
  const lifetimeTotalEarly = monthlyAtEarlyClaiming * 12 * yearsCollectingIfClaimEarly;
  const lifetimeTotalNormal = monthlyAtFullRetirement * 12 * yearsCollectingIfClaimNormal;
  const lifetimeTotalLate = monthlyAtLateClaiming * 12 * yearsCollectingIfClaimLate;
  
  return [
    {
      claimingAge: earlyClaimingAge,
      monthlyBenefit: monthlyAtEarlyClaiming,
      lifetimeTotal: lifetimeTotalEarly
    },
    {
      claimingAge: fullRetirementAge,
      monthlyBenefit: monthlyAtFullRetirement,
      lifetimeTotal: lifetimeTotalNormal
    },
    {
      claimingAge: lateClaimingAge,
      monthlyBenefit: monthlyAtLateClaiming,
      lifetimeTotal: lifetimeTotalLate
    }
  ];
}
