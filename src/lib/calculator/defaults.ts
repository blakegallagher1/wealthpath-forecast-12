
import { CalculatorInputs } from "./types";

export const calculatorDefaults: CalculatorInputs = {
  // Personal details
  name: "",
  spouseName: "",
  currentAge: 35,
  retirementAge: 65,
  spouseAge: 35,  // Default spouse age
  spouseRetirementAge: 65,  // Default spouse retirement age
  ssStartAge: 67,
  stateOfResidence: "CA",
  
  // Income & expenses
  annualIncome: 100000,
  incomeGrowthRate: 3.0,
  spouseIncome: 0,
  spouseIncomeGrowthRate: 3.0,
  expensePercentOfIncome: 70,
  annualBonusAmount: 0,
  retirementAnnualSpending: 70000,
  hasPension: false,
  pensionAmount: 0,
  
  // Assets & investments
  cashSavings: 25000,
  retirementAccounts: 150000,
  rothAccounts: 50000,
  taxableInvestments: 75000,
  realEstateEquity: 100000,
  annual401kContribution: 19500,
  annualRothContribution: 6000,
  annualTaxableContribution: 5000,
  investmentReturnRate: 7.0,
  riskProfile: "moderate",
  
  // Liabilities
  mortgageBalance: 300000,
  mortgageInterestRate: 4.0,
  studentLoanBalance: 25000,
  studentLoanInterestRate: 5.0,
  autoLoanBalance: 15000,
  autoLoanInterestRate: 3.5,
  creditCardBalance: 5000,
  creditCardInterestRate: 18.0,
  
  // Life events
  planningWedding: false,
  weddingYear: new Date().getFullYear() + 2,
  weddingCost: 30000,
  planningChildren: false,
  numberOfChildren: 2,
  childCostPerYear: 15000,
  planningHomePurchase: false,
  homePurchaseYear: new Date().getFullYear() + 3,
  homeDownPayment: 60000,
  
  // Financial assumptions
  inflationRate: 2.5,
  retirementWithdrawalRate: 4.0,
  lifeExpectancy: 90,
};
