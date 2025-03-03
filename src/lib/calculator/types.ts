
export interface CalculatorInputs {
  // Personal details
  name: string;
  spouseName: string;
  currentAge: number;
  retirementAge: number;
  spouseAge: number;  // Added for spouse's age
  spouseRetirementAge: number;  // Added for spouse's retirement age
  ssStartAge: number; // Social Security start age
  stateOfResidence: string;
  
  // Income & expenses
  annualIncome: number;
  incomeGrowthRate: number;
  spouseIncome: number;
  spouseIncomeGrowthRate: number;
  expensePercentOfIncome: number;
  annualBonusAmount: number;
  retirementAnnualSpending: number;
  hasPension: boolean;
  pensionAmount: number;
  
  // Assets & investments
  cashSavings: number;
  retirementAccounts: number;
  rothAccounts: number;
  taxableInvestments: number;
  realEstateEquity: number;
  annual401kContribution: number;
  annualRothContribution: number;
  annualTaxableContribution: number;
  investmentReturnRate: number;
  riskProfile: string;
  realEstateAppreciationRate: number; // Added real estate appreciation rate
  
  // Liabilities
  mortgageBalance: number;
  mortgageInterestRate: number;
  studentLoanBalance: number;
  studentLoanInterestRate: number;
  autoLoanBalance: number;
  autoLoanInterestRate: number;
  creditCardBalance: number;
  creditCardInterestRate: number;
  
  // Life events
  planningWedding: boolean;
  weddingYear: number;
  weddingCost: number;
  planningChildren: boolean;
  numberOfChildren: number;
  childCostPerYear: number;
  planningHomePurchase: boolean;
  homePurchaseYear: number;
  homeDownPayment: number;
  
  // Financial assumptions
  inflationRate: number;
  retirementWithdrawalRate: number;
  lifeExpectancy: number;
  socialSecurityBenefit?: number; // Keep optional for backward compatibility
  spouseSocialSecurityBenefit?: number; // Keep optional for backward compatibility
}

export interface NetWorthDataPoint {
  age: number;
  year?: number;
  cash: number;
  retirement: number;
  taxable: number;
  realEstate: number;
  total: number;
  isRetirementAge?: boolean;
}

export interface IncomeSourcesDataPoint {
  age: number;
  year?: number;
  primaryIncome: number;
  spouseIncome: number;
  socialSecurity: number;
  spouseSocialSecurity: number; // Added spouse social security as separate field
  retirement: number;
  pension: number;
  rmd: number;
  taxable: number;
  total?: number;
  isRetirementAge?: boolean;
}

export interface SocialSecurityDataPoint {
  claimingAge: number;
  monthlyBenefit: number;
  monthlySpouseBenefit: number; // Added spouse benefit field
  lifetimeTotal?: number;
}

export interface WithdrawalStrategyDataPoint {
  age: number;
  year?: number;
  conservative: number;
  moderate: number;
  aggressive: number;
  isRetirementAge?: boolean;
}

export interface RiskProfileDataPoint {
  age: number;
  year?: number;
  conservative: number;
  moderate: number;
  aggressive: number;
  isRetirementAge?: boolean;
}

export interface DebtPayoffDataPoint {
  age: number;
  year?: number;
  mortgageBalance: number;
  studentLoanBalance: number;
  autoLoanBalance: number;
  creditCardBalance: number;
  totalDebt: number;
  isRetirementAge?: boolean;
}

export interface RetirementPlan {
  // Summary metrics
  totalRetirementSavings: number;
  estimatedAnnualRetirementIncome: number;
  sustainabilityScore: number;
  successProbability: number;
  portfolioLongevity: number;
  
  // Chart data
  netWorthData: NetWorthDataPoint[];
  incomeSourcesData: IncomeSourcesDataPoint[];
  withdrawalStrategyData: WithdrawalStrategyDataPoint[];
  riskProfileData: RiskProfileDataPoint[];
  socialSecurityData: SocialSecurityDataPoint[];
  debtPayoffData: DebtPayoffDataPoint[];
  
  // User inputs (added for access in components)
  inputs?: CalculatorInputs;
  
  // Recommendations
  recommendations: string[];
}
