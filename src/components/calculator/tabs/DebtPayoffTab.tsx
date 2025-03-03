
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
