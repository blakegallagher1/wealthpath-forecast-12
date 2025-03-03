
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
    <Card>
      <CardHeader>
        <CardTitle>Net Worth Projection</CardTitle>
        <CardDescription>
          Breakdown of your projected net worth over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[500px]">
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
