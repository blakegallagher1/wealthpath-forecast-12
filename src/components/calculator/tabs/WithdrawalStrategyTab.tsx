
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalStrategyChart from "../charts/WithdrawalStrategyChart";
import { RetirementPlan } from "@/lib/calculator/types";

interface WithdrawalStrategyTabProps {
  plan: RetirementPlan;
}

const WithdrawalStrategyTab = ({ plan }: WithdrawalStrategyTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Strategy Comparison</CardTitle>
        <CardDescription>
          Comparing different withdrawal rate strategies for your retirement
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[96px]">
        <WithdrawalStrategyChart data={plan.withdrawalStrategyData} />
      </CardContent>
    </Card>
  );
};

export default WithdrawalStrategyTab;
