
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DebtPayoffChart from "../charts/DebtPayoffChart";
import { RetirementPlan } from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/formatters";

interface DebtPayoffTabProps {
  plan: RetirementPlan;
}

const DebtPayoffTab = ({ plan }: DebtPayoffTabProps) => {
  return (
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
  );
};

export default DebtPayoffTab;
