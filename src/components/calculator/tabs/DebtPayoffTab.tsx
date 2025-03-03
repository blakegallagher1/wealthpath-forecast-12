
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DebtPayoffChart from "../charts/DebtPayoffChart";
import { RetirementPlan } from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/formatters";

interface DebtPayoffTabProps {
  plan: RetirementPlan;
}

const DebtPayoffTab = ({ plan }: DebtPayoffTabProps) => {
  // Find the projected debt-free age
  const debtFreePoint = plan.debtPayoffData.find(point => 
    point.mortgageBalance === 0 && 
    point.studentLoanBalance === 0 && 
    point.autoLoanBalance === 0 && 
    point.creditCardBalance === 0
  );

  const debtFreeAge = debtFreePoint ? debtFreePoint.age : null;
  
  // Get initial total debt
  const initialDebt = plan.debtPayoffData[0]?.totalDebt || 0;
  
  // Get information about planned home purchase
  const homePurchasePlanned = plan.inputs?.planningHomePurchase || false;
  const homePurchaseYear = plan.inputs?.homePurchaseYear || 0;
  const homeDownPayment = plan.inputs?.homeDownPayment || 0;
  const currentYear = new Date().getFullYear();
  const yearsUntilPurchase = homePurchaseYear > currentYear ? homePurchaseYear - currentYear : 0;
  
  // Find the point where mortgage increases due to home purchase
  const purchasePoint = homePurchasePlanned 
    ? plan.debtPayoffData.find(point => point.year === homePurchaseYear)
    : null;
  
  // Get initial mortgage balance
  const initialMortgageBalance = plan.debtPayoffData[0]?.mortgageBalance || 0;
  
  // Get current mortgage balance (either initial or from purchase point)
  const currentMortgageBalance = initialMortgageBalance;
  
  // Calculate estimated home value (assuming 20% down payment)
  const estimatedHomeValue = homeDownPayment * 5; // 20% down payment
  const newMortgageAmount = purchasePoint ? purchasePoint.mortgageBalance : 0;
  
  // Calculate mortgage end point and payoff years
  let mortgageEndPoint = null;
  let mortgagePayoffYears = null;
  
  if (homePurchasePlanned && purchasePoint) {
    // For planned purchases, calculate from purchase point
    mortgageEndPoint = plan.debtPayoffData
      .filter(point => point.year >= homePurchaseYear)
      .find(point => point.mortgageBalance === 0);
      
    if (mortgageEndPoint && purchasePoint) {
      mortgagePayoffYears = mortgageEndPoint.age - purchasePoint.age;
    }
  } else if (initialMortgageBalance > 0) {
    // For existing mortgages
    const mortgageStartPoint = plan.debtPayoffData[0];
    mortgageEndPoint = plan.debtPayoffData.find(point => point.mortgageBalance === 0);
    
    if (mortgageEndPoint && mortgageStartPoint) {
      mortgagePayoffYears = mortgageEndPoint.age - mortgageStartPoint.age;
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Debt Payoff Timeline</CardTitle>
          <CardDescription className="text-sm">
            Track your journey to becoming debt-free over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] px-2 sm:px-6">
          <DebtPayoffChart data={plan.debtPayoffData} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 px-4">
            <CardTitle className="text-lg">Total Debt</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="text-xl sm:text-2xl font-bold">
              {formatCurrency(initialDebt)}
            </div>
            {debtFreeAge && (
              <p className="text-sm text-muted-foreground mt-2">
                Projected debt-free at age {debtFreeAge}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 px-4">
            <CardTitle className="text-lg">Mortgage</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="text-xl sm:text-2xl font-bold">
              {homePurchasePlanned && initialMortgageBalance === 0
                ? formatCurrency(newMortgageAmount) 
                : formatCurrency(initialMortgageBalance)}
            </div>
            {mortgagePayoffYears && (
              <p className="text-sm text-muted-foreground mt-2">
                Estimated payoff in {mortgagePayoffYears} years
              </p>
            )}
            
            {homePurchasePlanned && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-sm font-medium">Planned Home Purchase:</p>
                <div className="text-xs text-muted-foreground space-y-1 mt-1">
                  <div>Year: {homePurchaseYear} ({yearsUntilPurchase} years from now)</div>
                  <div>Down payment: {formatCurrency(homeDownPayment)}</div>
                  <div>Estimated home value: {formatCurrency(estimatedHomeValue)}</div>
                  {purchasePoint && (
                    <div>New mortgage: {formatCurrency(newMortgageAmount)}</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 px-4">
            <CardTitle className="text-lg">Other Debt</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="text-xl sm:text-2xl font-bold">
              {formatCurrency(
                (plan.debtPayoffData[0]?.studentLoanBalance || 0) +
                (plan.debtPayoffData[0]?.autoLoanBalance || 0) +
                (plan.debtPayoffData[0]?.creditCardBalance || 0)
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <div>Student Loans: {formatCurrency(plan.debtPayoffData[0]?.studentLoanBalance || 0)}</div>
              <div>Auto Loans: {formatCurrency(plan.debtPayoffData[0]?.autoLoanBalance || 0)}</div>
              <div>Credit Cards: {formatCurrency(plan.debtPayoffData[0]?.creditCardBalance || 0)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebtPayoffTab;
