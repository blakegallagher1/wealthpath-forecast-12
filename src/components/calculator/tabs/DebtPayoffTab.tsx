
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DebtPayoffChart from "../charts/DebtPayoffChart";
import { RetirementPlan } from "@/lib/calculator/types";

interface DebtPayoffTabProps {
  plan: RetirementPlan;
}

const DebtPayoffTab = ({ plan }: DebtPayoffTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Debt Payoff Schedule</CardTitle>
        <CardDescription>
          Projected timeline for paying off your debts
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[500px]">
        <DebtPayoffChart data={plan.debtPayoffData} />
      </CardContent>
    </Card>
  );
};

export default DebtPayoffTab;
