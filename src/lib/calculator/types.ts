
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
  socialSecurityBenefit: number;
  spouseSocialSecurityBenefit: number;
}

export interface NetWorthDataPoint {
  age: number;
  cash: number;
  retirement: number;
  taxable: number;
  realEstate: number;
}

export interface IncomeSourcesDataPoint {
  age: number;
  employment: number;
  retirement: number;
  socialSecurity: number;
  pension: number;
  rmd?: number; // Required Minimum Distributions
  taxable?: number; // Income from taxable accounts
}

export interface SocialSecurityDataPoint {
  claimingAge: number;
  monthlyBenefit: number;
}

export interface WithdrawalStrategyDataPoint {
  age: number;
  conservative: number; // 3% withdrawal
  moderate: number;     // 4% withdrawal
  aggressive: number;   // 5% withdrawal
}

export interface RiskProfileDataPoint {
  age: number;
  conservative: number;
  moderate: number;
  aggressive: number;
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
  socialSecurityData: SocialSecurityDataPoint[];
  withdrawalStrategyData: WithdrawalStrategyDataPoint[];
  riskProfileData: RiskProfileDataPoint[];
  
  // Recommendations
  recommendations: string[];
}
