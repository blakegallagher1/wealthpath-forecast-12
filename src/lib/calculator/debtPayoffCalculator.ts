
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
  
  // Calculate mortgage payment using amortization formula
  const mortgageRate = inputs.mortgageInterestRate / 100;
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
  
  // Student loans: 10-year term
  const studentLoanRate = inputs.studentLoanInterestRate / 100;
  const studentLoanYearsRemaining = 10;
  let annualStudentLoanPayment = 0;
  if (studentLoanBalance > 0 && studentLoanRate > 0) {
    const monthlyStudentLoanRate = studentLoanRate / 12;
    const studentLoanPayments = studentLoanYearsRemaining * 12;
    const monthlyStudentLoanPayment = studentLoanBalance * 
                                      (monthlyStudentLoanRate * Math.pow(1 + monthlyStudentLoanRate, studentLoanPayments)) / 
                                      (Math.pow(1 + monthlyStudentLoanRate, studentLoanPayments) - 1);
    annualStudentLoanPayment = monthlyStudentLoanPayment * 12;
  }
  
  // Auto loans: 5-year term
  const autoLoanRate = inputs.autoLoanInterestRate / 100;
  const autoLoanYearsRemaining = 5;
  let annualAutoLoanPayment = 0;
  if (autoLoanBalance > 0 && autoLoanRate > 0) {
    const monthlyAutoLoanRate = autoLoanRate / 12;
    const autoLoanPayments = autoLoanYearsRemaining * 12;
    const monthlyAutoLoanPayment = autoLoanBalance * 
                                  (monthlyAutoLoanRate * Math.pow(1 + monthlyAutoLoanRate, autoLoanPayments)) / 
                                  (Math.pow(1 + monthlyAutoLoanRate, autoLoanPayments) - 1);
    annualAutoLoanPayment = monthlyAutoLoanPayment * 12;
  }
  
  // Credit cards: aggressive payoff (2 years)
  const creditCardRate = inputs.creditCardInterestRate / 100;
  const creditCardYearsRemaining = 2;
  let annualCreditCardPayment = 0;
  if (creditCardBalance > 0 && creditCardRate > 0) {
    const monthlyCreditCardRate = creditCardRate / 12;
    const creditCardPayments = creditCardYearsRemaining * 12;
    const monthlyCreditCardPayment = creditCardBalance * 
                                    (monthlyCreditCardRate * Math.pow(1 + monthlyCreditCardRate, creditCardPayments)) / 
                                    (Math.pow(1 + monthlyCreditCardRate, creditCardPayments) - 1);
    annualCreditCardPayment = monthlyCreditCardPayment * 12;
  }

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
      
      // Recalculate mortgage payment with new balance
      if (mortgageBalance > 0 && mortgageRate > 0) {
        monthlyMortgagePayment = mortgageBalance * 
                                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        annualMortgagePayment = monthlyMortgagePayment * 12;
      }
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
    
    // Mortgage amortization calculation
    if (mortgageBalance > 0) {
      // Calculate interest portion of payment
      const annualInterest = mortgageBalance * mortgageRate;
      
      // Calculate principal portion of payment
      const principalPayment = Math.min(annualMortgagePayment - annualInterest, mortgageBalance);
      
      // Update mortgage balance
      mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
    }
    
    // Student loan amortization
    if (studentLoanBalance > 0) {
      const annualStudentLoanInterest = studentLoanBalance * studentLoanRate;
      const studentLoanPrincipal = Math.min(annualStudentLoanPayment - annualStudentLoanInterest, studentLoanBalance);
      studentLoanBalance = Math.max(0, studentLoanBalance - studentLoanPrincipal);
    }
    
    // Auto loan amortization
    if (autoLoanBalance > 0) {
      const annualAutoLoanInterest = autoLoanBalance * autoLoanRate;
      const autoLoanPrincipal = Math.min(annualAutoLoanPayment - annualAutoLoanInterest, autoLoanBalance);
      autoLoanBalance = Math.max(0, autoLoanBalance - autoLoanPrincipal);
    }
    
    // Credit card amortization
    if (creditCardBalance > 0) {
      const annualCreditCardInterest = creditCardBalance * creditCardRate;
      const creditCardPrincipal = Math.min(annualCreditCardPayment - annualCreditCardInterest, creditCardBalance);
      creditCardBalance = Math.max(0, creditCardBalance - creditCardPrincipal);
    }
  }
  
  return data;
};
