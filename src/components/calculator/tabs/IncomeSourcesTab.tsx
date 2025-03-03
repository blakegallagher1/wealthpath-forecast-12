
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
        <CardTitle>Income Sources</CardTitle>
        <CardDescription>
          Breakdown of your projected income sources during retirement
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[500px]">
        <IncomeSourcesChart data={plan.incomeSourcesData} />
      </CardContent>
    </Card>
  );
};

export default IncomeSourcesTab;
