
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
  
  // Calculate estimated duration for mortgage payoff
  const mortgageStartPoint = plan.debtPayoffData[0];
  const mortgageEndPoint = plan.debtPayoffData.find(point => point.mortgageBalance === 0);
  const mortgagePayoffYears = mortgageEndPoint && mortgageStartPoint 
    ? mortgageEndPoint.age - mortgageStartPoint.age 
    : null;

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
    
  // Calculate estimated home value (assuming 20% down payment)
  const estimatedHomeValue = homeDownPayment * 5; // 20% down payment
  const newMortgageAmount = purchasePoint ? purchasePoint.mortgageBalance : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Debt Payoff Timeline</CardTitle>
          <CardDescription>
            Track your journey to becoming debt-free over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <DebtPayoffChart data={plan.debtPayoffData} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Debt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mortgage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mortgageStartPoint?.mortgageBalance || 0)}
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Other Debt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                (mortgageStartPoint?.studentLoanBalance || 0) +
                (mortgageStartPoint?.autoLoanBalance || 0) +
                (mortgageStartPoint?.creditCardBalance || 0)
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <div>Student Loans: {formatCurrency(mortgageStartPoint?.studentLoanBalance || 0)}</div>
              <div>Auto Loans: {formatCurrency(mortgageStartPoint?.autoLoanBalance || 0)}</div>
              <div>Credit Cards: {formatCurrency(mortgageStartPoint?.creditCardBalance || 0)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebtPayoffTab;
