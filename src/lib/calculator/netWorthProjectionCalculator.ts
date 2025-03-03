
import { CalculatorInputs, NetWorthDataPoint } from "./types";
import { calculateLifeEventsImpact } from "./netWorthLifeEventsCalculator";
import { 
  updateRealEstateCycle, 
  calculateRealEstateReturn 
} from "./utils/marketCycleUtils";
import { 
  calculateMonthlyMortgagePayment, 
  processMortgagePayment 
} from "./utils/mortgageUtils";
import { calculateInvestmentGrowth } from "./utils/investmentAccountUtils";
import { estimateSocialSecurityBenefit } from "./socialSecurityCalculator";

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
  let realEstateEquity = inputs.realEstateEquity || 0;
  let mortgageBalance = inputs.mortgageBalance || 0;
  let otherDebts = (inputs.studentLoanBalance || 0) + (inputs.autoLoanBalance || 0) + (inputs.creditCardBalance || 0);
  
  // Calculate annual expenses and savings
  const annualExpenses = (inputs.annualIncome + (inputs.spouseIncome || 0)) * ((inputs.expensePercentOfIncome || 70) / 100);
  let annualSavings = ((inputs.annualIncome || 0) + (inputs.spouseIncome || 0) + (inputs.annualBonusAmount || 0)) - annualExpenses - 
                      (inputs.annual401kContribution || 0) - (inputs.annualRothContribution || 0) - (inputs.annualTaxableContribution || 0);
  
  // Calculate mortgage payment
  const mortgageRate = (inputs.mortgageInterestRate || 0) / 100;
  const mortgageYearsRemaining = 30; // Standard 30-year mortgage
  
  // Calculate monthly mortgage payment
  const monthlyMortgagePayment = calculateMonthlyMortgagePayment(
    mortgageBalance, 
    mortgageRate, 
    mortgageYearsRemaining
  );
  
  let annualMortgagePayment = monthlyMortgagePayment * 12;
  
  // Real estate market cycle and volatility
  let realEstateMarketCycle = 0; // 0 = neutral, positive = bull, negative = bear
  let realEstateCycleLength = 0;
  
  // Base real estate appreciation rate (default 3% if not specified)
  const baseRealEstateAppreciationRate = inputs.realEstateAppreciationRate ? inputs.realEstateAppreciationRate / 100 : 0.03;
  const realEstateVolatility = 0.02; // Lower volatility than stocks
  
  // Keep track of home value separate from equity
  let homeValue = realEstateEquity + mortgageBalance;
  
  // Initialize market cycle for investments
  let marketCycle = 0; // 0 = neutral, positive = bull, negative = bear
  
  // Keep track of retirement withdrawal amount for smoother transitions
  let retirementWithdrawalAmount = 0;
  
  // Estimate Social Security benefits
  const estimatedSocialSecurity = estimateSocialSecurityBenefit(inputs.annualIncome, inputs.stateOfResidence); // Monthly benefit
  const estimatedSpouseSocialSecurity = inputs.spouseIncome ? 
    estimateSocialSecurityBenefit(inputs.spouseIncome, inputs.stateOfResidence) : 0; // Monthly benefit for spouse
  
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
      const newMonthlyPayment = calculateMonthlyMortgagePayment(
        mortgageBalance, 
        mortgageRate, 
        mortgageYearsRemaining
      );
      annualMortgagePayment = newMonthlyPayment * 12;
    }
    
    // Update real estate market cycle
    const realEstateCycleUpdate = updateRealEstateCycle(realEstateMarketCycle, realEstateCycleLength);
    realEstateMarketCycle = realEstateCycleUpdate.cycle;
    realEstateCycleLength = realEstateCycleUpdate.length;
    
    // Generate real estate return with market cycle effects
    const realEstateReturn = calculateRealEstateReturn(
      baseRealEstateAppreciationRate,
      realEstateVolatility,
      realEstateMarketCycle
    );
    
    // Special handling for retirement transition (1 year before and after retirement)
    const isNearRetirement = Math.abs(age - inputs.retirementAge) <= 1;
    
    // Calculate retirement income
    let retirementIncome = 0;
    if (age >= inputs.retirementAge) {
      // Add social security if eligible
      if (age >= inputs.ssStartAge) {
        retirementIncome += estimatedSocialSecurity * 12; // Convert monthly to annual
        // Add spouse social security if applicable
        if (inputs.spouseName && inputs.spouseAge) {
          const spouseCurrentAge = inputs.spouseAge + (age - inputs.currentAge);
          if (spouseCurrentAge >= inputs.ssStartAge) {
            retirementIncome += estimatedSpouseSocialSecurity * 12; // Convert monthly to annual
          }
        }
      }
      
      // Add pension if applicable
      if (inputs.hasPension && inputs.pensionAmount) {
        retirementIncome += inputs.pensionAmount;
      }
      
      // Calculate withdrawal needed after accounting for other income
      const withdrawalNeeded = Math.max(0, inputs.retirementAnnualSpending - retirementIncome);
      
      // Gradually adjust retirement withdrawal for smoother transition
      if (isNearRetirement) {
        retirementWithdrawalAmount = (retirementWithdrawalAmount * 0.7) + (withdrawalNeeded * 0.3);
      } else {
        retirementWithdrawalAmount = withdrawalNeeded;
      }
    }
    
    // Update investment accounts based on whether retired or not
    const investmentUpdates = calculateInvestmentGrowth(
      age, 
      inputs, 
      retirementAccounts, 
      rothAccounts, 
      taxableInvestments, 
      cashSavings,
      annualSavings,
      marketCycle,
      retirementWithdrawalAmount,
      retirementIncome
    );
    
    retirementAccounts = investmentUpdates.retirementAccounts;
    rothAccounts = investmentUpdates.rothAccounts;
    taxableInvestments = investmentUpdates.taxableInvestments;
    cashSavings = investmentUpdates.cashSavings;
    marketCycle = investmentUpdates.marketCycle;
    
    // Real estate appreciation with market cycle effects
    // Only apply real estate appreciation if there is actually real estate
    if (homeValue > 0) {
      homeValue *= (1 + realEstateReturn);
      
      // Mortgage amortization calculation
      if (mortgageBalance > 0) {
        mortgageBalance = processMortgagePayment(
          mortgageBalance,
          mortgageRate,
          annualMortgagePayment
        );
        
        // Update real estate equity based on new home value and mortgage balance
        realEstateEquity = homeValue - mortgageBalance;
      } else {
        // If mortgage is paid off, all home value is equity
        realEstateEquity = homeValue;
      }
    }
    
    // Reduce other debts - add some randomness to debt payoff rate
    const debtPayoffRate = 0.15 + Math.random() * 0.1; // Between 15-25% per year
    otherDebts = Math.max(0, otherDebts * (1 - debtPayoffRate));
    
    // Age increases with each year
    age++;
  }
  
  return data;
}

