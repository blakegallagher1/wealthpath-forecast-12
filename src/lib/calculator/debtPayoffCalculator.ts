
import { CalculatorInputs, DebtPayoffDataPoint } from "./types";

// Generate debt payoff timeline data
export const generateDebtPayoffData = (inputs: CalculatorInputs): DebtPayoffDataPoint[] => {
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
