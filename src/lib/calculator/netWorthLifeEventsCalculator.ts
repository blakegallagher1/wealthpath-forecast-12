
import { CalculatorInputs } from "./types";

/**
 * Calculates the financial impact of life events for a specific year
 * @param inputs Calculator input values
 * @param projectedYear The year being projected
 * @param homeValue Current home value
 * @param mortgageBalance Current mortgage balance
 * @param realEstateEquity Current real estate equity
 * @returns Object containing the financial impacts of life events
 */
export const calculateLifeEventsImpact = (
  inputs: CalculatorInputs,
  projectedYear: number,
  homeValue: number,
  mortgageBalance: number,
  realEstateEquity: number
): { 
  yearlyLifeEventCosts: number; 
  homeValueAdjustment: number;
  newMortgageBalance: number;
  newEquity: number;
} => {
  let yearlyLifeEventCosts = 0;
  let homeValueAdjustment = 0;
  let newMortgageBalance = mortgageBalance;
  let newEquity = realEstateEquity;
  
  // Variables for life events
  const weddingYear = inputs.planningWedding ? inputs.weddingYear : 0;
  const childrenStart = inputs.planningChildren ? (new Date().getFullYear() + 1) : 0; // Assuming children costs start next year
  const planningHomePurchase = inputs.planningHomePurchase;
  const homePurchaseYear = inputs.planningHomePurchase ? inputs.homePurchaseYear : 0;
  const homeDownPayment = inputs.homeDownPayment;
  
  // Wedding costs in the wedding year
  if (weddingYear === projectedYear) {
    yearlyLifeEventCosts += inputs.weddingCost;
  }
  
  // Home purchase in the purchase year
  if (planningHomePurchase && homePurchaseYear === projectedYear) {
    // Calculate full home value based on down payment (assuming 20% down payment)
    const fullHomeValue = homeDownPayment * 5; // Down payment is 20% of home value
    
    // Set initial equity to down payment amount
    newEquity = realEstateEquity + homeDownPayment;
    
    // Set new mortgage to 80% of home value
    newMortgageBalance = mortgageBalance + (fullHomeValue - homeDownPayment);
    
    // Update home value adjustment
    homeValueAdjustment = fullHomeValue;
    
    // Add down payment to yearly costs
    yearlyLifeEventCosts += homeDownPayment;
  }
  
  // Children costs for 18 years per child
  if (inputs.planningChildren && projectedYear >= childrenStart && projectedYear < childrenStart + 18) {
    yearlyLifeEventCosts += inputs.numberOfChildren * inputs.childCostPerYear;
  }
  
  return { 
    yearlyLifeEventCosts, 
    homeValueAdjustment,
    newMortgageBalance,
    newEquity
  };
};
