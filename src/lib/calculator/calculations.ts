import { calculateNetWorthProjection } from "./netWorthCalculator";
import { generateIncomeSourcesData } from "./incomeSourcesCalculator";
import { generateWithdrawalStrategyData } from "./withdrawalStrategyCalculator";
import { generateRiskProfileData } from "./riskProfileCalculator";
import { generateSocialSecurityData } from "./socialSecurityCalculator";
import { CalculatorInputs, RetirementPlan, DebtPayoffDataPoint } from "./types";

export const calculateRetirementPlan = (inputs: CalculatorInputs): RetirementPlan => {
  // Calculate impact of life events on savings
  const lifeEventImpact = calculateLifeEventImpact(inputs);
  
  // Calculate remaining years until retirement
  const yearsUntilRetirement = inputs.retirementAge - inputs.currentAge;
  
  // Calculate current total assets
  const totalAssets = inputs.cashSavings + 
                      inputs.retirementAccounts + 
                      inputs.rothAccounts + 
                      inputs.taxableInvestments + 
                      inputs.realEstateEquity;
  
  // Calculate current total liabilities
  const totalLiabilities = inputs.mortgageBalance + 
                           inputs.studentLoanBalance + 
                           inputs.autoLoanBalance + 
                           inputs.creditCardBalance;
  
  // Calculate current net worth
  const currentNetWorth = totalAssets - totalLiabilities;
  
  // Calculate total annual contributions to retirement accounts
  const annualRetirementContributions = inputs.annual401kContribution + 
                                        inputs.annualRothContribution + 
                                        inputs.annualTaxableContribution;
  
  // Calculate projected retirement savings at retirement age
  // Apply compound interest formula: P(1+r)^t + PMT[((1+r)^t - 1)/r]
  // Where P = principal, r = rate, t = time, PMT = periodic payment
  const retirementSavings = (inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments) * 
                           Math.pow(1 + inputs.investmentReturnRate / 100, yearsUntilRetirement) + 
                           (annualRetirementContributions * 
                           (Math.pow(1 + inputs.investmentReturnRate / 100, yearsUntilRetirement) - 1) / 
                           (inputs.investmentReturnRate / 100));
  
  // Subtract life event costs from final retirement savings
  const adjustedRetirementSavings = retirementSavings - lifeEventImpact;
  
  // Calculate estimated annual retirement income
  // Using the 4% rule (or user-specified withdrawal rate)
  const withdrawalAmount = adjustedRetirementSavings * (inputs.retirementWithdrawalRate / 100);
  
  // Add social security and pension (if applicable)
  const annualSocialSecurity = inputs.socialSecurityBenefit * 12;
  const annualSpouseSocialSecurity = inputs.spouseSocialSecurityBenefit * 12;
  const annualPension = inputs.hasPension ? inputs.pensionAmount : 0;
  
  const totalAnnualRetirementIncome = withdrawalAmount + annualSocialSecurity + annualSpouseSocialSecurity + annualPension;
  
  // Calculate sustainability score (0-100)
  // Based on income replacement ratio, portfolio longevity, and diversification
  const incomeReplacementRatio = totalAnnualRetirementIncome / inputs.retirementAnnualSpending;
  const sustainabilityScore = Math.min(100, Math.max(0, Math.round(incomeReplacementRatio * 50) + 
                                                     (inputs.retirementWithdrawalRate <= 4 ? 30 : 
                                                      inputs.retirementWithdrawalRate <= 5 ? 20 : 10) + 
                                                     (inputs.investmentReturnRate >= 5 ? 20 : 10)));
  
  // Calculate success probability
  // This is simplified, in reality would use Monte Carlo simulations
  const successProbability = Math.min(99, Math.max(1, Math.round(sustainabilityScore * 0.95)));
  
  // Calculate portfolio longevity
  // Simplified: how long would money last at specified withdrawal rate
  const retirementYears = inputs.lifeExpectancy - inputs.retirementAge;
  const inflationAdjustedReturn = inputs.investmentReturnRate - inputs.inflationRate;
  
  let portfolioLongevity = inputs.retirementAge;
  let remainingBalance = adjustedRetirementSavings;
  
  for (let i = 0; i < 50; i++) { // Max 50 years after retirement
    if (remainingBalance <= 0) break;
    
    remainingBalance = remainingBalance * (1 + inflationAdjustedReturn / 100) - 
                      inputs.retirementAnnualSpending * Math.pow(1 + inputs.inflationRate / 100, i);
    
    if (remainingBalance > 0) {
      portfolioLongevity++;
    }
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (inputs.retirementWithdrawalRate > 4) {
    recommendations.push("Consider reducing your withdrawal rate to improve sustainability.");
  }
  
  if (incomeReplacementRatio < 0.7) {
    recommendations.push("Your estimated retirement income may be insufficient. Consider increasing savings or delaying retirement.");
  }
  
  if (inputs.annual401kContribution < 19500 && inputs.annualIncome > 100000) {
    recommendations.push("Maximize your 401(k) contributions to take advantage of tax benefits.");
  }
  
  if (inputs.creditCardBalance > 0) {
    recommendations.push("Pay off high-interest credit card debt before focusing on investments.");
  }
  
  if (portfolioLongevity < inputs.lifeExpectancy) {
    recommendations.push(`Your savings may run out at age ${portfolioLongevity}. Consider adjusting your retirement strategy.`);
  }
  
  // Calculate data for charts
  const netWorthData = calculateNetWorthProjection(inputs, lifeEventImpact);
  const incomeSourcesData = generateIncomeSourcesData(inputs);
  const withdrawalStrategyData = generateWithdrawalStrategyData(inputs);
  const riskProfileData = generateRiskProfileData(inputs);
  const socialSecurityData = generateSocialSecurityData(inputs);
  const debtPayoffData = generateDebtPayoffData(inputs);
  
  return {
    totalRetirementSavings: adjustedRetirementSavings,
    estimatedAnnualRetirementIncome: totalAnnualRetirementIncome,
    sustainabilityScore,
    successProbability,
    portfolioLongevity,
    recommendations,
    netWorthData,
    incomeSourcesData,
    withdrawalStrategyData,
    riskProfileData,
    socialSecurityData,
    debtPayoffData,
  };
};

// Helper function to calculate the impact of life events on savings
const calculateLifeEventImpact = (inputs: CalculatorInputs): number => {
  let totalImpact = 0;
  const currentYear = new Date().getFullYear();
  
  // Wedding costs
  if (inputs.planningWedding) {
    const yearsToWedding = Math.max(0, inputs.weddingYear - currentYear);
    // Calculate present value of future wedding costs
    if (yearsToWedding === 0) {
      // If wedding is this year, full impact
      totalImpact += inputs.weddingCost;
    } else {
      // Calculate how much would need to be saved from now until wedding
      // Assuming the amount grows with investment return rate
      const monthlyContribution = inputs.weddingCost / (yearsToWedding * 12);
      // This is simplified - in reality would need to calculate growing annuity
      totalImpact += monthlyContribution * 12; // Annual impact on savings
    }
  }
  
  // Children costs
  if (inputs.planningChildren) {
    // Assuming children costs start 1 year from now and continue for 18 years per child
    const totalChildrenCost = inputs.numberOfChildren * inputs.childCostPerYear * 18;
    // Simplified: estimate how much this reduces retirement savings
    // Assuming about 15% of child costs would have gone to retirement otherwise
    totalImpact += totalChildrenCost * 0.15;
  }
  
  // Home purchase
  if (inputs.planningHomePurchase) {
    const yearsToHomePurchase = Math.max(0, inputs.homePurchaseYear - currentYear);
    if (yearsToHomePurchase === 0) {
      // If home purchase is this year, full down payment impact
      totalImpact += inputs.homeDownPayment;
    } else {
      // Calculate how much would need to be saved annually for down payment
      const annualSavingsForDownPayment = inputs.homeDownPayment / yearsToHomePurchase;
      totalImpact += annualSavingsForDownPayment; // Annual impact on other savings
    }
  }
  
  return totalImpact;
};

// Generate debt payoff timeline data
const generateDebtPayoffData = (inputs: CalculatorInputs): DebtPayoffDataPoint[] => {
  const currentYear = new Date().getFullYear();
  const projectionYears = Math.max(inputs.lifeExpectancy - inputs.currentAge, 50);
  const data: DebtPayoffDataPoint[] = [];
  
  // Initial debt balances
  let mortgageBalance = inputs.mortgageBalance;
  let studentLoanBalance = inputs.studentLoanBalance;
  let autoLoanBalance = inputs.autoLoanBalance;
  let creditCardBalance = inputs.creditCardBalance;
  
  // Estimated annual payments (simplified model)
  // Mortgage: 30-year term with fixed payment
  const mortgageYearsRemaining = mortgageBalance > 0 ? 30 : 0;
  const annualMortgagePayment = mortgageBalance > 0 ? (mortgageBalance / mortgageYearsRemaining) * 1.1 : 0; // Adding 10% for interest
  
  // Student loans: 10-year term
  const studentLoanYearsRemaining = studentLoanBalance > 0 ? 10 : 0;
  const annualStudentLoanPayment = studentLoanBalance > 0 ? (studentLoanBalance / studentLoanYearsRemaining) * 1.05 : 0; // Adding 5% for interest
  
  // Auto loans: 5-year term
  const autoLoanYearsRemaining = autoLoanBalance > 0 ? 5 : 0;
  const annualAutoLoanPayment = autoLoanBalance > 0 ? (autoLoanBalance / autoLoanYearsRemaining) * 1.04 : 0; // Adding 4% for interest
  
  // Credit cards: aggressive payoff (2 years)
  const creditCardYearsRemaining = creditCardBalance > 0 ? 2 : 0;
  const annualCreditCardPayment = creditCardBalance > 0 ? (creditCardBalance / creditCardYearsRemaining) * 1.18 : 0; // Adding 18% for interest

  // Variables for planned home purchase
  const planningHomePurchase = inputs.planningHomePurchase;
  const homePurchaseYear = inputs.planningHomePurchase ? inputs.homePurchaseYear : 0;
  const homeDownPayment = inputs.homeDownPayment;
  
  // Process each year
  for (let year = 0; year < projectionYears; year++) {
    const age = inputs.currentAge + year;
    const projectedYear = currentYear + year;
    
    // Handle home purchase
    if (planningHomePurchase && homePurchaseYear === projectedYear) {
      // Calculate new mortgage (assuming 20% down payment, so mortgage is 80% of home value)
      const fullHomeValue = homeDownPayment * 5; // Down payment is 20% of home value
      const newMortgage = fullHomeValue - homeDownPayment;
      
      // Add new mortgage to existing mortgage (if there is one)
      mortgageBalance += newMortgage;
    }
    
    // Calculate total debt for this year
    const totalDebt = mortgageBalance + studentLoanBalance + autoLoanBalance + creditCardBalance;
    
    // Add data point
    data.push({
      age,
      year: projectedYear,
      mortgageBalance,
      studentLoanBalance,
      autoLoanBalance,
      creditCardBalance,
      totalDebt,
      isRetirementAge: age === inputs.retirementAge,
    });
    
    // Update balances for next year
    mortgageBalance = Math.max(0, mortgageBalance - annualMortgagePayment);
    studentLoanBalance = Math.max(0, studentLoanBalance - annualStudentLoanPayment);
    autoLoanBalance = Math.max(0, autoLoanBalance - annualAutoLoanPayment);
    creditCardBalance = Math.max(0, creditCardBalance - annualCreditCardPayment);
  }
  
  return data;
};
