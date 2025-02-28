
import { Client } from "@/pages/AdvisorDashboard";

export const generateMockClients = (count: number): Client[] => {
  const clients: Client[] = [];
  const statuses = ["new", "active", "pending", "completed"];
  const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Laura", "Robert", "Linda", "James", "Patricia"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];
  
  const generateTags = () => {
    const allTags = ["Pre-Retirement", "Retired", "401(k)", "IRA", "Social Security", "Pension", "High Net Worth", "Small Business Owner", "Educator", "Healthcare", "Government", "Military"];
    const shuffled = [...allTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
  };
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)] as "new" | "active" | "pending" | "completed";
    
    clients.push({
      id: `client-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      status,
      lastContact: `${Math.floor(Math.random() * 30) + 1} days ago`,
      retirementAge: Math.floor(Math.random() * 10) + 60,
      currentSavings: Math.floor(Math.random() * 900000) + 100000,
      monthlyContribution: Math.floor(Math.random() * 3000) + 500,
      retirementGoal: Math.floor(Math.random() * 2000000) + 1000000,
      successProbability: Math.floor(Math.random() * 60) + 40,
      tags: generateTags()
    });
  }
  
  return clients;
};

export const generateClientData = (client: Client) => {
  // Calculate client age based on retirement age
  const currentAge = client.retirementAge - Math.floor(Math.random() * 15) - 10; // 10-25 years before retirement
  const lifeExpectancy = 90;
  
  // Generate years for charting
  const years = Array.from({ length: lifeExpectancy - currentAge + 1 }, (_, i) => currentAge + i);
  
  // Generate net worth data
  const netWorthData = years.map(age => {
    let multiplier = 1;
    
    if (age < client.retirementAge) {
      // Growth phase
      multiplier = 1 + ((age - currentAge) / (client.retirementAge - currentAge));
    } else {
      // Drawdown phase
      multiplier = 1 - ((age - client.retirementAge) / (lifeExpectancy - client.retirementAge)) * 0.7;
    }
    
    const baseValue = client.currentSavings * multiplier;
    const randomVariation = (Math.random() * 0.2 - 0.1) * baseValue; // +/- 10% random variation
    
    return {
      age,
      year: new Date().getFullYear() + (age - currentAge),
      value: Math.max(0, baseValue + randomVariation),
      conservativeValue: Math.max(0, baseValue * 0.9),
      aggressiveValue: Math.max(0, baseValue * 1.1),
      isRetirementAge: age === client.retirementAge,
    };
  });
  
  // Generate income sources data
  const incomeSourcesData = years.map(age => {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetired = age >= client.retirementAge;
    
    // Before retirement: work income
    // After retirement: social security, pension, investment income
    return {
      age,
      year,
      workIncome: isRetired ? 0 : 60000 + (Math.random() * 20000),
      socialSecurity: isRetired ? 24000 + (Math.random() * 6000) : 0,
      pension: isRetired ? (Math.random() > 0.5 ? 12000 + (Math.random() * 10000) : 0) : 0,
      investmentIncome: isRetired ? (client.currentSavings / 25) * (1 + (Math.random() * 0.2 - 0.1)) : 0,
      otherIncome: Math.random() > 0.7 ? 5000 + (Math.random() * 5000) : 0,
      total: isRetired ? 0 : 60000 + (Math.random() * 20000), // Will be calculated below
      isRetirementAge: age === client.retirementAge,
    };
  }).map(item => {
    // Calculate total
    item.total = item.workIncome + item.socialSecurity + item.pension + item.investmentIncome + item.otherIncome;
    return item;
  });
  
  // Generate cashflow data
  const cashflowData = years.map(age => {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetired = age >= client.retirementAge;
    
    const income = isRetired 
      ? 24000 + (Math.random() * 6000) + (Math.random() > 0.5 ? 12000 + (Math.random() * 10000) : 0) + (client.currentSavings / 25) 
      : 60000 + (Math.random() * 20000);
      
    const expenses = isRetired
      ? 40000 + (Math.random() * 10000) 
      : 50000 + (Math.random() * 15000);
      
    return {
      year,
      age,
      income,
      expenses,
      isRetirementAge: age === client.retirementAge,
    };
  });
  
  // Generate social security data
  const socialSecurityData = [
    { claimingAge: 62, monthlyBenefit: 1800, lifetimeTotal: 486000 },
    { claimingAge: 65, monthlyBenefit: 2200, lifetimeTotal: 528000 },
    { claimingAge: 67, monthlyBenefit: 2500, lifetimeTotal: 550000 },
    { claimingAge: 70, monthlyBenefit: 3100, lifetimeTotal: 589000 },
  ];
  
  // Current budget data
  const budgetData = {
    categories: [
      { name: "Housing", value: 1500 },
      { name: "Food", value: 600 },
      { name: "Transportation", value: 400 },
      { name: "Healthcare", value: 300 },
      { name: "Entertainment", value: 250 },
      { name: "Utilities", value: 200 },
      { name: "Insurance", value: 150 },
      { name: "Other", value: 350 },
    ]
  };
  
  // Retirement budget data
  const retirementBudgetData = {
    categories: [
      { name: "Housing", value: 1200 },
      { name: "Food", value: 650 },
      { name: "Transportation", value: 250 },
      { name: "Healthcare", value: 800 },
      { name: "Entertainment", value: 400 },
      { name: "Utilities", value: 200 },
      { name: "Insurance", value: 200 },
      { name: "Travel", value: 500 },
      { name: "Other", value: 300 },
    ]
  };
  
  // Current asset allocation
  const currentAssetAllocation = [
    { name: "U.S. Stocks", value: client.currentSavings * 0.40 },
    { name: "International Stocks", value: client.currentSavings * 0.20 },
    { name: "Bonds", value: client.currentSavings * 0.30 },
    { name: "Cash", value: client.currentSavings * 0.05 },
    { name: "Real Estate", value: client.currentSavings * 0.05 },
  ];
  
  // Recommended asset allocation
  const recommendedAssetAllocation = [
    { name: "U.S. Stocks", value: client.currentSavings * 0.45 },
    { name: "International Stocks", value: client.currentSavings * 0.25 },
    { name: "Bonds", value: client.currentSavings * 0.20 },
    { name: "Cash", value: client.currentSavings * 0.05 },
    { name: "Real Estate", value: client.currentSavings * 0.05 },
  ];
  
  // Asset growth data with categories
  const assetGrowthData = years.map(age => {
    const year = new Date().getFullYear() + (age - currentAge);
    const isRetired = age >= client.retirementAge;
    
    // Total values will change over time
    let multiplier = 1;
    
    if (age < client.retirementAge) {
      // Growth phase
      multiplier = 1 + ((age - currentAge) / (client.retirementAge - currentAge));
    } else {
      // Drawdown phase
      multiplier = 1 - ((age - client.retirementAge) / (lifeExpectancy - client.retirementAge)) * 0.7;
    }
    
    const totalAssets = client.currentSavings * multiplier;
    
    return {
      year,
      age,
      value: totalAssets, // Total value
      stocks: totalAssets * (isRetired ? 0.4 : 0.6), // Stocks portion
      bonds: totalAssets * (isRetired ? 0.4 : 0.3), // Bonds portion
      cash: totalAssets * (isRetired ? 0.1 : 0.05), // Cash portion
      realEstate: totalAssets * (isRetired ? 0.1 : 0.05), // Real estate portion
      isRetirementAge: age === client.retirementAge,
    };
  });
  
  // Recommendations based on the client's situation
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Low success probability
    if (client.successProbability < 70) {
      recommendations.push({
        title: "Increase retirement savings",
        description: "Consider increasing your monthly contribution by $500 to improve your retirement outlook.",
        type: "warning"
      });
    }
    
    // Not maxing out retirement accounts
    if (client.monthlyContribution < 2000) {
      recommendations.push({
        title: "Maximize retirement accounts",
        description: "You're not fully utilizing tax-advantaged retirement accounts. Consider increasing contributions.",
        type: "warning"
      });
    }
    
    // Asset allocation
    recommendations.push({
      title: "Optimize asset allocation",
      description: "Adjust your portfolio to increase international exposure for better diversification.",
      type: "positive"
    });
    
    // Social Security
    recommendations.push({
      title: "Delay Social Security",
      description: "Consider waiting until age 70 to claim Social Security for maximum lifetime benefits.",
      type: client.retirementAge < 70 ? "positive" : "success"
    });
    
    // Additional recommendation if they have a low success rate
    if (client.successProbability < 60) {
      recommendations.push({
        title: "Extend working years",
        description: "Consider working 2-3 years longer to significantly improve your retirement security.",
        type: "danger"
      });
    }
    
    return recommendations;
  };
  
  return {
    netWorthData,
    incomeData: incomeSourcesData,
    cashflowData,
    socialSecurityData,
    budgetData,
    retirementBudgetData,
    currentAssetAllocation,
    recommendedAssetAllocation,
    assetGrowthData,
    currentNetWorth: client.currentSavings,
    netWorthChange: client.currentSavings * 0.08,
    projectedRetirementSavings: client.currentSavings * 2.5,
    monthlyRetirementIncome: (client.retirementGoal * 0.04) / 12,
    incomeReplacementRate: 75,
    portfolioLongevity: client.retirementAge + (client.successProbability > 80 ? 25 : client.successProbability > 60 ? 20 : 15),
    investmentRateOfReturn: 7.2,
    recommendations: generateRecommendations()
  };
};
