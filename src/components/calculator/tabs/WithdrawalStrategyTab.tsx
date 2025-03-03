import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalStrategyChart from "../charts/WithdrawalStrategyChart";
import { RetirementPlan } from "@/lib/calculator/types";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { formatSummaryValue } from "../utils/formatters";

interface WithdrawalStrategyTabProps {
  plan: RetirementPlan;
}

const WithdrawalStrategyTab = ({ plan }: WithdrawalStrategyTabProps) => {
  // Find the withdrawal values at retirement age
  const retirementData = plan.withdrawalStrategyData.find(d => d.isRetirementAge);
  
  // If we have retirement data, calculate initial withdrawal amounts
  const initialWithdrawals = retirementData ? {
    conservative: retirementData.conservative * 0.03,
    moderate: retirementData.moderate * 0.04,
    aggressive: retirementData.aggressive * 0.05
  } : { conservative: 0, moderate: 0, aggressive: 0 };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Withdrawal Strategy Analysis</CardTitle>
              <CardDescription>
                Comparison of different withdrawal rates and their impact on portfolio longevity
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              <span>Adjusted for Inflation</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <WithdrawalStrategyChart data={plan.withdrawalStrategyData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              Conservative Strategy (3%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {formatSummaryValue(initialWithdrawals.conservative, 0)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Lower withdrawal rate for longer-lasting portfolio with less spending power.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500"></span>
              Moderate Strategy (4%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {formatSummaryValue(initialWithdrawals.moderate, 0)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Traditional "4% rule" balancing longevity and spending needs.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              Aggressive Strategy (5%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {formatSummaryValue(initialWithdrawals.aggressive, 0)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ year</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Higher withdrawal rate for more spending power but shorter portfolio lifespan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawalStrategyTab;
