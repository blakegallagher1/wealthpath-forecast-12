
/**
 * Utilities for mortgage calculations
 */

/**
 * Calculates the monthly mortgage payment using the amortization formula
 * P = L[c(1 + c)^n]/[(1 + c)^n - 1]
 * where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
 * 
 * @param mortgageBalance Current mortgage balance
 * @param mortgageRate Annual mortgage interest rate (as a decimal)
 * @param mortgageYearsRemaining Years remaining on the mortgage
 * @returns Monthly mortgage payment
 */
export const calculateMonthlyMortgagePayment = (
  mortgageBalance: number,
  mortgageRate: number,
  mortgageYearsRemaining: number = 30
): number => {
  if (mortgageBalance <= 0 || mortgageRate <= 0) {
    return 0;
  }
  
  const monthlyRate = mortgageRate / 12;
  const numberOfPayments = mortgageYearsRemaining * 12;
  
  return mortgageBalance * 
         (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
};

/**
 * Processes a year of mortgage payments
 * @param mortgageBalance Current mortgage balance
 * @param mortgageRate Annual mortgage interest rate (as a decimal)
 * @param annualMortgagePayment Annual mortgage payment amount
 * @returns Updated mortgage balance
 */
export const processMortgagePayment = (
  mortgageBalance: number,
  mortgageRate: number,
  annualMortgagePayment: number
): number => {
  if (mortgageBalance <= 0) {
    return 0;
  }
  
  // Calculate interest portion of payment
  const annualInterest = mortgageBalance * mortgageRate;
  
  // Calculate principal portion of payment
  const principalPayment = Math.min(annualMortgagePayment - annualInterest, mortgageBalance);
  
  // Update mortgage balance
  return Math.max(0, mortgageBalance - principalPayment);
};
