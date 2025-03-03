
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NetWorthChart from "../charts/NetWorthChart";
import { RetirementPlan } from "@/lib/calculator/types";

interface NetWorthTabProps {
  plan: RetirementPlan;
}

const NetWorthTab = ({ plan }: NetWorthTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth Projection</CardTitle>
        <CardDescription>
          Breakdown of your projected net worth over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <NetWorthChart data={plan.netWorthData} />
      </CardContent>
    </Card>
  );
};

export default NetWorthTab;
