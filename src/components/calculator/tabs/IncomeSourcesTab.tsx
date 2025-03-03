
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IncomeSourcesChart from "../charts/IncomeSourcesChart";
import { RetirementPlan } from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useMobile } from "@/hooks/use-mobile";

interface IncomeSourcesTabProps {
  plan: RetirementPlan;
}

const IncomeBreakdownCard = ({ title, items }: { title: string, items: { label: string, value: number, color?: string }[] }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-muted/30 rounded-md p-3">
      <h4 className="font-medium text-sm mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              {item.color && (
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
              )}
              <span>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatCurrency(item.value)}</span>
              <span className="text-muted-foreground">
                ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
        <Separator className="my-2" />
        <div className="flex justify-between items-center text-xs font-medium">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

const IncomeSourcesTab = ({ plan }: IncomeSourcesTabProps) => {
  const isMobile = useMobile();
  // Safely check for data existence
  const incomeSourcesData = plan?.incomeSourcesData || [];
  
  // Calculate the total expected retirement income
  const retirementIncomeData = incomeSourcesData.find(data => data.isRetirementAge) || null;
  const totalRetirementIncome = retirementIncomeData?.total || 0;
  
  // Find social security starting age data point
  const ssStartingPoint = incomeSourcesData.find(data => (data.socialSecurity || 0) > 0) || null;
  const ssStartAge = ssStartingPoint?.age || 0;
  
  // Calculate primary vs spouse income
  const preRetirementDataPoint = incomeSourcesData.find(data => !data.isRetirementAge && data.age >= plan.inputs?.currentAge!) || null;
  const primaryWorkingIncome = preRetirementDataPoint?.primaryIncome || 0;
  const spouseWorkingIncome = preRetirementDataPoint?.spouseIncome || 0;
  
  // Get Social Security values
  const primarySS = retirementIncomeData?.socialSecurity || 0;
  const spouseSS = retirementIncomeData?.spouseSocialSecurity || 0;
  
  // Get retirement account withdrawals
  const retirementWithdrawals = retirementIncomeData?.retirement || 0;
  const rmdWithdrawals = retirementIncomeData?.rmd || 0;
  const taxableWithdrawals = retirementIncomeData?.taxable || 0;
  const pensionIncome = retirementIncomeData?.pension || 0;
  
  const preRetirementItems = [
    { label: "Primary Income", value: primaryWorkingIncome, color: "#3b82f6" },
    ...(spouseWorkingIncome > 0 ? [{ label: "Spouse Income", value: spouseWorkingIncome, color: "#6366f1" }] : [])
  ];
  
  const postRetirementItems = [
    ...(primarySS > 0 ? [{ label: "Primary Social Security", value: primarySS, color: "#8b5cf6" }] : []),
    ...(spouseSS > 0 ? [{ label: "Spouse Social Security", value: spouseSS, color: "#a855f7" }] : []),
    ...(pensionIncome > 0 ? [{ label: "Pension", value: pensionIncome, color: "#10b981" }] : []),
    ...(retirementWithdrawals > 0 ? [{ label: "Retirement Withdrawals", value: retirementWithdrawals, color: "#ec4899" }] : []),
    ...(rmdWithdrawals > 0 ? [{ label: "Required Min. Distributions", value: rmdWithdrawals, color: "#f59e0b" }] : []),
    ...(taxableWithdrawals > 0 ? [{ label: "Taxable Account Withdrawals", value: taxableWithdrawals, color: "#06b6d4" }] : [])
  ];
  
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
        <div className="h-[300px] sm:h-[400px] mb-4">
          {incomeSourcesData.length > 0 ? (
            <IncomeSourcesChart data={incomeSourcesData} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No income source data available</p>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="preRetirement" className="mt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="preRetirement">Pre-Retirement Income</TabsTrigger>
            <TabsTrigger value="postRetirement">Retirement Income</TabsTrigger>
          </TabsList>
          <TabsContent value="preRetirement" className="mt-2">
            <IncomeBreakdownCard 
              title="Pre-Retirement Income Breakdown" 
              items={preRetirementItems}
            />
          </TabsContent>
          <TabsContent value="postRetirement" className="mt-2">
            <IncomeBreakdownCard 
              title="Retirement Income Breakdown" 
              items={postRetirementItems}
            />
          </TabsContent>
        </Tabs>
        
        {/* Income Replacement Rate */}
        {primaryWorkingIncome > 0 && totalRetirementIncome > 0 && (
          <div className="mt-4 bg-muted/30 rounded-md p-3">
            <h4 className="font-medium text-sm mb-2">Income Replacement Analysis</h4>
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div className="text-xs">
                <span className="font-medium">Income Replacement Rate: </span>
                <span className={`${totalRetirementIncome/primaryWorkingIncome >= 0.7 ? 'text-green-600' : 'text-amber-600'}`}>
                  {Math.round((totalRetirementIncome/primaryWorkingIncome) * 100)}%
                </span>
                <p className="text-muted-foreground mt-1">
                  Financial experts typically recommend a 70-80% income replacement rate in retirement.
                </p>
              </div>
              <div className="text-xs">
                <span className="font-medium">Working Income: </span>
                <span>{formatCurrency(primaryWorkingIncome)}/year</span>
                <br />
                <span className="font-medium">Retirement Income: </span>
                <span>{formatCurrency(totalRetirementIncome)}/year</span>
                <br />
                <span className="font-medium">Difference: </span>
                <span className={`${totalRetirementIncome >= primaryWorkingIncome ? 'text-green-600' : 'text-amber-600'}`}>
                  {totalRetirementIncome >= primaryWorkingIncome ? '+' : ''}
                  {formatCurrency(totalRetirementIncome - primaryWorkingIncome)}/year
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeSourcesTab;
