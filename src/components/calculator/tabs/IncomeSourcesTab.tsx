
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IncomeSourcesChart from "../charts/IncomeSourcesChart";
import { RetirementPlan } from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/formatters";

interface IncomeSourcesTabProps {
  plan: RetirementPlan;
}

const IncomeSourcesTab = ({ plan }: IncomeSourcesTabProps) => {
  // Safely check for data existence
  const incomeSourcesData = plan?.incomeSourcesData || [];
  
  // Calculate the total expected retirement income
  const retirementIncomeData = incomeSourcesData.find(data => data.isRetirementAge) || null;
  const totalRetirementIncome = retirementIncomeData?.total || 0;
  
  // Find social security starting age data point
  const ssStartingPoint = incomeSourcesData.find(data => (data.socialSecurity || 0) > 0) || null;
  const ssStartAge = ssStartingPoint?.age || 0;
  
  // Calculate primary vs spouse income
  const primaryWorkingIncome = incomeSourcesData.find(data => (data.primaryIncome || 0) > 0)?.primaryIncome || 0;
  const spouseWorkingIncome = incomeSourcesData.find(data => (data.spouseIncome || 0) > 0)?.spouseIncome || 0;
  
  // Get Social Security values
  const primarySS = ssStartingPoint?.socialSecurity || 0;
  const spouseSS = ssStartingPoint?.spouseSocialSecurity || 0;
  const totalSS = primarySS + spouseSS;
  
  // Summarize data
  const hasSpouseIncome = incomeSourcesData.some(data => (data.spouseIncome || 0) > 0) || false;
  const hasSpouseSS = incomeSourcesData.some(data => (data.spouseSocialSecurity || 0) > 0) || false;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Sources Through Retirement</CardTitle>
        <CardDescription>
          Visualizing the transition from working income to retirement income
          {ssStartAge > 0 && <span className="block mt-1 text-sm">Social Security begins at age {ssStartAge}</span>}
          
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
            
            {totalSS > 0 && (
              <div className="text-sm">
                <p className="font-medium">Social Security Income:</p>
                <p>{formatCurrency(primarySS)}/year primary</p>
                {hasSpouseSS && <p>{formatCurrency(spouseSS)}/year spouse</p>}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {incomeSourcesData.length > 0 ? (
          <IncomeSourcesChart data={incomeSourcesData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No income source data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeSourcesTab;
