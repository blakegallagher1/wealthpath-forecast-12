
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IncomeSourcesChart from "../charts/IncomeSourcesChart";
import { RetirementPlan } from "@/lib/calculator/types";

interface IncomeSourcesTabProps {
  plan: RetirementPlan;
}

const IncomeSourcesTab = ({ plan }: IncomeSourcesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Sources Through Retirement</CardTitle>
        <CardDescription>
          Visualizing the transition from working income to retirement income
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <IncomeSourcesChart data={plan.incomeSourcesData} />
      </CardContent>
    </Card>
  );
};

export default IncomeSourcesTab;
