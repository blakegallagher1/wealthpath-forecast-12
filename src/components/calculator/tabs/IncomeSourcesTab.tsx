
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
    <Card className="w-full shadow-sm">
      <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-2xl">Income Sources Through Retirement</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Visualizing the transition from working income to retirement income
          {ssStartAge > 0 && <span className="block mt-1 text-xs sm:text-sm">Social Security begins at age {ssStartAge}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="text-xs sm:text-sm p-2 bg-muted/40 rounded-md">
            <p className="font-medium">Primary Working Income:</p>
            <p>{formatCurrency(primaryWorkingIncome)}/year</p>
          </div>
          
          {hasSpouseIncome && (
            <div className="text-xs sm:text-sm p-2 bg-muted/40 rounded-md">
              <p className="font-medium">Spouse Working Income:</p>
              <p>{formatCurrency(spouseWorkingIncome)}/year</p>
            </div>
          )}
          
          <div className="text-xs sm:text-sm p-2 bg-muted/40 rounded-md">
            <p className="font-medium">Total Retirement Income:</p>
            <p>{formatCurrency(totalRetirementIncome)}/year</p>
          </div>
          
          {totalSS > 0 && (
            <div className="text-xs sm:text-sm p-2 bg-muted/40 rounded-md">
              <p className="font-medium">Social Security Income:</p>
              <p>{formatCurrency(primarySS)}/year primary</p>
              {hasSpouseSS && <p>{formatCurrency(spouseSS)}/year spouse</p>}
            </div>
          )}
        </div>
        
        <div className="h-[300px] sm:h-[400px]">
          {incomeSourcesData.length > 0 ? (
            <IncomeSourcesChart data={incomeSourcesData} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No income source data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSourcesTab;
