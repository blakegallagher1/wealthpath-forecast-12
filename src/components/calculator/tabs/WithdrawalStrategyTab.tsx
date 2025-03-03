
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
        <CardTitle>Withdrawal Strategy Analysis</CardTitle>
        <CardDescription>
          Comparison of different withdrawal rates and their impact on portfolio longevity
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <WithdrawalStrategyChart data={plan.withdrawalStrategyData} />
      </CardContent>
    </Card>
  );
};

export default WithdrawalStrategyTab;
