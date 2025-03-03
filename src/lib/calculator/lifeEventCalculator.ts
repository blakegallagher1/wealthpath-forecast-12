
import { CalculatorInputs } from "./types";

// Helper function to calculate the impact of life events on savings
export const calculateLifeEventImpact = (inputs: CalculatorInputs): number => {
  let totalImpact = 0;
  const currentYear = new Date().getFullYear();
  
  // Wedding costs
  if (inputs.planningWedding) {
    const yearsToWedding = Math.max(0, inputs.weddingYear - currentYear);
    // Calculate present value of future wedding costs
    if (yearsToWedding === 0) {
      // If wedding is this year, full impact
      totalImpact += inputs.weddingCost;
    } else {
      // Calculate how much would need to be saved from now until wedding
      // Assuming the amount grows with investment return rate
      const monthlyContribution = inputs.weddingCost / (yearsToWedding * 12);
      // This is simplified - in reality would need to calculate growing annuity
      totalImpact += monthlyContribution * 12; // Annual impact on savings
    }
  }
  
  // Children costs
  if (inputs.planningChildren) {
    // Assuming children costs start 1 year from now and continue for 18 years per child
    const totalChildrenCost = inputs.numberOfChildren * inputs.childCostPerYear * 18;
    // Simplified: estimate how much this reduces retirement savings
    // Assuming about 15% of child costs would have gone to retirement otherwise
    totalImpact += totalChildrenCost * 0.15;
  }
  
  // Home purchase
  if (inputs.planningHomePurchase) {
    const yearsToHomePurchase = Math.max(0, inputs.homePurchaseYear - currentYear);
    if (yearsToHomePurchase === 0) {
      // If home purchase is this year, full down payment impact
      totalImpact += inputs.homeDownPayment;
    } else {
      // Calculate how much would need to be saved annually for down payment
      const annualSavingsForDownPayment = inputs.homeDownPayment / yearsToHomePurchase;
      totalImpact += annualSavingsForDownPayment; // Annual impact on other savings
    }
  }
  
  return totalImpact;
};
