
import { CalculatorInputs, NetWorthDataPoint } from "./types";
import { calculateLifeEventsImpact } from "./netWorthLifeEventsCalculator";
import { calculateInvestmentGrowth } from "./netWorthInvestmentCalculator";

/**
 * Calculates the projected net worth over time based on user inputs
 * @param inputs Calculator input values
 * @param lifeEventImpact Overall impact from life events
 * @returns Array of net worth data points for each projection year
 */
export const calculateNetWorthProjection = (inputs: CalculatorInputs, lifeEventImpact: number): NetWorthDataPoint[] => {
  const currentYear = new Date().getFullYear();
  const projectionYears = Math.max(inputs.lifeExpectancy - inputs.currentAge, 50);
  const data: NetWorthDataPoint[] = [];
  
  // Initial values
  let age = inputs.currentAge;
  let cashSavings = inputs.cashSavings;
  let retirementAccounts = inputs.retirementAccounts;
  let rothAccounts = inputs.rothAccounts;
  let taxableInvestments = inputs.taxableInvestments;
  let realEstateEquity = inputs.realEstateEquity;
  let mortgageBalance = inputs.mortgageBalance;
  let otherDebts = inputs.studentLoanBalance + inputs.autoLoanBalance + inputs.creditCardBalance;
  
  // Calculate annual expenses and savings
  const annualExpenses = (inputs.annualIncome + (inputs.spouseIncome || 0)) * ((inputs.expensePercentOfIncome || 70) / 100);
  let annualSavings = ((inputs.annualIncome || 0) + (inputs.spouseIncome || 0) + (inputs.annualBonusAmount || 0)) - annualExpenses - 
                      (inputs.annual401kContribution || 0) - (inputs.annualRothContribution || 0) - (inputs.annualTaxableContribution || 0);
  
  // Calculate mortgage payment using amortization formula
  const mortgageRate = (inputs.mortgageInterestRate || 0) / 100;
  const mortgageYearsRemaining = 30; // Standard 30-year mortgage
  const monthlyRate = mortgageRate / 12;
  const numberOfPayments = mortgageYearsRemaining * 12;
  
  // Calculate monthly mortgage payment using the amortization formula
  // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  // where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
  let monthlyMortgagePayment = 0;
  if (mortgageBalance > 0 && mortgageRate > 0) {
    monthlyMortgagePayment = mortgageBalance * 
                            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }
  
  let annualMortgagePayment = monthlyMortgagePayment * 12;
  
  // Real estate market cycle and volatility
  let realEstateMarketCycle = 0; // 0 = neutral, positive = bull, negative = bear
  let realEstateCycleLength = 0;
  const maxRealEstateCycleLength = 8; // Real estate cycles tend to be longer than stock market cycles
  
  // Base real estate appreciation rate (default 3% if not specified)
  const baseRealEstateAppreciationRate = 0.03; // 3% annual appreciation
  const realEstateVolatility = 0.03; // Lower volatility than stocks
  
  // Keep track of home value separate from equity
  let homeValue = realEstateEquity + mortgageBalance;
  
  // Initialize market cycle for investments
  let marketCycle = 0; // 0 = neutral, positive = bull, negative = bear
  
  for (let year = 0; year < projectionYears; year++) {
    const projectedYear = currentYear + year;
    const currentNetWorth = cashSavings + retirementAccounts + rothAccounts + taxableInvestments + 
                            realEstateEquity - mortgageBalance - otherDebts;
    
    // Format the data to match NetWorthDataPoint requirements
    data.push({
      age,
      year: projectedYear,
      cash: cashSavings,
      retirement: retirementAccounts + rothAccounts,
      taxable: taxableInvestments,
      realEstate: realEstateEquity,
      total: Math.max(0, currentNetWorth),
      isRetirementAge: age === inputs.retirementAge,
    });
    
    // Process life events for this year
    const { yearlyLifeEventCosts, homeValueAdjustment, newMortgageBalance, newEquity } = 
      calculateLifeEventsImpact(inputs, projectedYear, homeValue, mortgageBalance, realEstateEquity);
    
    // Apply life event impacts
    cashSavings = Math.max(0, cashSavings - yearlyLifeEventCosts);
    if (homeValueAdjustment > 0) {
      homeValue += homeValueAdjustment;
      mortgageBalance = newMortgageBalance;
      realEstateEquity = newEquity;
      
      // Recalculate mortgage payment with new balance
      if (mortgageBalance > 0 && mortgageRate > 0) {
        monthlyMortgagePayment = mortgageBalance * 
                                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        annualMortgagePayment = monthlyMortgagePayment * 12;
      }
    }
    
    // Update real estate market cycle
    if (realEstateCycleLength <= 0) {
      // Generate a new real estate market cycle
      realEstateMarketCycle = (Math.random() - 0.5) * 2; // Between -1 and 1
      realEstateCycleLength = Math.floor(Math.random() * maxRealEstateCycleLength) + 3; // Minimum 3 years
    } else {
      realEstateCycleLength--;
      // More gradual changes in real estate
      realEstateMarketCycle *= 0.9;
    }
    
    // Generate real estate return with volatility and market cycle effects
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const cycleFactor = 1 + realEstateMarketCycle * 0.3; // ±30% adjustment based on cycle
    const realEstateReturn = Math.max(-0.15, (baseRealEstateAppreciationRate + realEstateVolatility * z) * cycleFactor);
    
    // Update investment accounts based on whether retired or not
    const investmentUpdates = calculateInvestmentGrowth(
      age, 
      inputs, 
      retirementAccounts, 
      rothAccounts, 
      taxableInvestments, 
      cashSavings,
      annualSavings,
      marketCycle
    );
    
    retirementAccounts = investmentUpdates.retirementAccounts;
    rothAccounts = investmentUpdates.rothAccounts;
    taxableInvestments = investmentUpdates.taxableInvestments;
    cashSavings = investmentUpdates.cashSavings;
    marketCycle = investmentUpdates.marketCycle;
    
    // Real estate appreciation with market cycle effects
    homeValue *= (1 + realEstateReturn);
    
    // Mortgage amortization calculation
    if (mortgageBalance > 0) {
      // Calculate interest portion of payment
      const annualInterest = mortgageBalance * mortgageRate;
      
      // Calculate principal portion of payment
      const principalPayment = Math.min(annualMortgagePayment - annualInterest, mortgageBalance);
      
      // Update mortgage balance
      mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
      
      // Update real estate equity based on new home value and mortgage balance
      realEstateEquity = homeValue - mortgageBalance;
    } else {
      // If mortgage is paid off, all home value is equity
      realEstateEquity = homeValue;
    }
    
    // Reduce other debts - add some randomness to debt payoff rate
    const debtPayoffRate = 0.15 + Math.random() * 0.1; // Between 15-25% per year
    otherDebts = Math.max(0, otherDebts * (1 - debtPayoffRate));
    
    // Age increases with each year
    age++;
  }
  
  return data;
}
