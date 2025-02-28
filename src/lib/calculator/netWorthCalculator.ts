
import { CalculatorInputs } from "./types";

export const calculateNetWorthProjection = (inputs: CalculatorInputs, lifeEventImpact: number) => {
  const currentYear = new Date().getFullYear();
  const projectionYears = Math.max(inputs.lifeExpectancy - inputs.currentAge, 50);
  const data = [];
  
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
  const annualExpenses = (inputs.annualIncome + inputs.spouseIncome) * (inputs.expensePercentOfIncome / 100);
  let annualSavings = (inputs.annualIncome + inputs.spouseIncome + inputs.annualBonusAmount) - annualExpenses - 
                      inputs.annual401kContribution - inputs.annualRothContribution - inputs.annualTaxableContribution;
  
  // Assuming 30-year mortgage, calculate annual principal payment (simplified)
  const annualMortgagePayment = mortgageBalance > 0 ? mortgageBalance / 30 : 0;
  
  // Life events tracking
  const weddingYear = inputs.planningWedding ? inputs.weddingYear : 0;
  const homePurchaseYear = inputs.planningHomePurchase ? inputs.homePurchaseYear : 0;
  const childrenStart = inputs.planningChildren ? currentYear + 1 : 0; // Assuming children costs start next year
  
  for (let year = 0; year < projectionYears; year++) {
    const currentNetWorth = cashSavings + retirementAccounts + rothAccounts + taxableInvestments + realEstateEquity - mortgageBalance - otherDebts;
    const projectedYear = currentYear + year;
    
    data.push({
      age,
      year: projectedYear,
      netWorth: Math.max(0, currentNetWorth),
      assets: cashSavings + retirementAccounts + rothAccounts + taxableInvestments + realEstateEquity,
      liabilities: mortgageBalance + otherDebts,
      isRetired: age >= inputs.retirementAge,
    });
    
    // Handle life events
    let yearlyLifeEventCosts = 0;
    
    // Wedding costs in the wedding year
    if (weddingYear === projectedYear) {
      yearlyLifeEventCosts += inputs.weddingCost;
    }
    
    // Home purchase in the purchase year
    if (homePurchaseYear === projectedYear) {
      yearlyLifeEventCosts += inputs.homeDownPayment;
      realEstateEquity += inputs.homeDownPayment; // Down payment becomes equity
      // Assuming new mortgage is about 4x down payment (80% LTV)
      mortgageBalance += inputs.homeDownPayment * 4;
    }
    
    // Children costs for 18 years per child
    if (inputs.planningChildren && projectedYear >= childrenStart && projectedYear < childrenStart + 18) {
      yearlyLifeEventCosts += inputs.numberOfChildren * inputs.childCostPerYear;
    }
    
    // Reduce cash savings by life event costs
    cashSavings = Math.max(0, cashSavings - yearlyLifeEventCosts);
    
    // Update for next year based on whether retired or not
    if (age < inputs.retirementAge) {
      // Pre-retirement: Income and contributions growing
      
      // Apply income growth rate
      annualSavings *= (1 + inputs.incomeGrowthRate / 100);
      
      // Update investment accounts with contributions and growth
      retirementAccounts = retirementAccounts * (1 + inputs.investmentReturnRate / 100) + inputs.annual401kContribution;
      rothAccounts = rothAccounts * (1 + inputs.investmentReturnRate / 100) + inputs.annualRothContribution;
      taxableInvestments = taxableInvestments * (1 + inputs.investmentReturnRate / 100) + inputs.annualTaxableContribution;
      
      // Update cash with remaining savings (after life events)
      cashSavings = Math.max(0, cashSavings + annualSavings);
      
      // Reduce debts
      mortgageBalance = Math.max(0, mortgageBalance - annualMortgagePayment);
      otherDebts = Math.max(0, otherDebts * 0.8); // Simple assumption: 20% of other debt paid off each year
      
      // Real estate appreciation
      realEstateEquity *= (1 + 0.03); // Assuming 3% annual appreciation
    } else {
      // Post-retirement: Drawing down accounts
      const withdrawalRate = inputs.retirementWithdrawalRate / 100;
      
      // Social Security and pension income
      let retirementIncome = 0;
      if (age >= inputs.ssStartAge) {
        retirementIncome += inputs.socialSecurityBenefit * 12;
        // Add spouse social security if applicable
        if (inputs.spouseName && age - inputs.currentAge + inputs.spouseAge >= inputs.ssStartAge) {
          retirementIncome += inputs.spouseSocialSecurityBenefit * 12;
        }
      }
      
      // Add pension if applicable
      if (inputs.hasPension) {
        retirementIncome += inputs.pensionAmount;
      }
      
      // Calculate withdrawal needed after accounting for SS and pension
      const withdrawalNeeded = Math.max(0, inputs.retirementAnnualSpending - retirementIncome);
      
      // Determine withdrawal from each account (simplified strategy)
      const totalInvestments = retirementAccounts + rothAccounts + taxableInvestments;
      if (totalInvestments > 0) {
        const retirementPortion = retirementAccounts / totalInvestments;
        const rothPortion = rothAccounts / totalInvestments;
        const taxablePortion = taxableInvestments / totalInvestments;
        
        // Withdraw proportionally from each account
        const retirementWithdrawal = withdrawalNeeded * retirementPortion;
        const rothWithdrawal = withdrawalNeeded * rothPortion;
        const taxableWithdrawal = withdrawalNeeded * taxablePortion;
        
        // Update accounts after withdrawal and growth
        retirementAccounts = Math.max(0, (retirementAccounts - retirementWithdrawal) * (1 + inputs.investmentReturnRate / 100));
        rothAccounts = Math.max(0, (rothAccounts - rothWithdrawal) * (1 + inputs.investmentReturnRate / 100));
        taxableInvestments = Math.max(0, (taxableInvestments - taxableWithdrawal) * (1 + inputs.investmentReturnRate / 100));
      } else {
        // If investments are depleted, use cash savings
        cashSavings = Math.max(0, cashSavings - withdrawalNeeded);
      }
      
      // Continue reducing debts
      mortgageBalance = Math.max(0, mortgageBalance - annualMortgagePayment);
      otherDebts = Math.max(0, otherDebts * 0.8);
      
      // Real estate appreciation continues
      realEstateEquity *= (1 + 0.03);
    }
    
    // Age increases with each year
    age++;
  }
  
  return data;
};
