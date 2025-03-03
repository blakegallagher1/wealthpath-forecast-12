
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NetWorthChart from "../charts/NetWorthChart";
import { RetirementPlan } from "@/lib/calculator/types";

interface NetWorthTabProps {
  plan: RetirementPlan;
}

const NetWorthTab = ({ plan }: NetWorthTabProps) => {
  // Ensure we have valid data
  const hasData = plan && plan.netWorthData && plan.netWorthData.length > 0;

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Net Worth Projection</CardTitle>
        <CardDescription className="text-sm">
          Breakdown of your projected net worth over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] px-2 sm:px-6">
        {hasData ? (
          <NetWorthChart data={plan.netWorthData} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No projection data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetWorthTab;
