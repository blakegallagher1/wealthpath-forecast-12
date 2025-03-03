
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IncomeSourcesChart from "../charts/IncomeSourcesChart";
import { RetirementPlan } from "@/lib/calculator/types";

interface IncomeSourcesTabProps {
  plan: RetirementPlan;
}

const IncomeSourcesTab = ({ plan }: IncomeSourcesTabProps) => {
  // Calculate the total expected retirement income
  const retirementIncomeData = plan.incomeSourcesData.find(data => data.isRetirementAge);
  const totalRetirementIncome = retirementIncomeData?.total || 0;
  
  // Find social security starting age data point
  const ssStartingPoint = plan.incomeSourcesData.find(data => data.socialSecurity > 0);
  const ssStartAge = ssStartingPoint?.age;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Sources Through Retirement</CardTitle>
        <CardDescription>
          Visualizing the transition from working income to retirement income
          {ssStartAge && <span className="block mt-1 text-sm">Social Security begins at age {ssStartAge}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <IncomeSourcesChart data={plan.incomeSourcesData} />
      </CardContent>
    </Card>
  );
};

export default IncomeSourcesTab;
