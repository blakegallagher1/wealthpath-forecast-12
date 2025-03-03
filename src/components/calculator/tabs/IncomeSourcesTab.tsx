
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IncomeSourcesChart from "../charts/IncomeSourcesChart";
import { RetirementPlan } from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/formatters";

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
  
  // Calculate primary vs spouse income
  const primaryWorkingIncome = plan.incomeSourcesData.find(data => data.primaryIncome > 0)?.primaryIncome || 0;
  const spouseWorkingIncome = plan.incomeSourcesData.find(data => data.spouseIncome > 0)?.spouseIncome || 0;
  
  // Summarize data
  const hasSpouseIncome = plan.incomeSourcesData.some(data => data.spouseIncome > 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Sources Through Retirement</CardTitle>
        <CardDescription>
          Visualizing the transition from working income to retirement income
          {ssStartAge && <span className="block mt-1 text-sm">Social Security begins at age {ssStartAge}</span>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="text-sm">
              <p className="font-medium">Primary Working Income:</p>
              <p>{formatCurrency(primaryWorkingIncome)}/year</p>
            </div>
            
            {hasSpouseIncome && (
              <div className="text-sm">
                <p className="font-medium">Spouse Working Income:</p>
                <p>{formatCurrency(spouseWorkingIncome)}/year</p>
              </div>
            )}
            
            <div className="text-sm">
              <p className="font-medium">Total Retirement Income:</p>
              <p>{formatCurrency(totalRetirementIncome)}/year</p>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <IncomeSourcesChart data={plan.incomeSourcesData} />
      </CardContent>
    </Card>
  );
};

export default IncomeSourcesTab;
