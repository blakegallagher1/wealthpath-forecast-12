
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WithdrawalStrategyChart from "../charts/WithdrawalStrategyChart";
import { RetirementPlan } from "@/lib/calculator/types";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle } from "lucide-react";
import { formatSummaryValue } from "../utils/formatters";
import { findDepletionAge, calculateLongevity } from "../charts/utils/chartFormatters";

interface WithdrawalStrategyTabProps {
  plan: RetirementPlan;
}

const WithdrawalStrategyTab = ({ plan }: WithdrawalStrategyTabProps) => {
  // Find the withdrawal values at retirement age
  const retirementData = plan.withdrawalStrategyData.find(d => d.isRetirementAge);
  
  // Calculate initial annual withdrawal amounts based on the withdrawal rates
  const initialWithdrawals = retirementData ? {
    conservative: retirementData.conservative * 0.03,
    moderate: retirementData.moderate * 0.04,
    aggressive: retirementData.aggressive * 0.05
  } : { conservative: 0, moderate: 0, aggressive: 0 };

  // Find depletion ages for each strategy
  const aggressiveDepletionAge = findDepletionAge(plan.withdrawalStrategyData, 'aggressive');
  const moderateDepletionAge = findDepletionAge(plan.withdrawalStrategyData, 'moderate');
  const conservativeDepletionAge = findDepletionAge(plan.withdrawalStrategyData, 'conservative');

  // Find retirement age
  const retirementAge = retirementData?.age || 65;
  
  // Calculate portfolio longevity in years for each strategy
  const aggressiveLongevity = aggressiveDepletionAge ? aggressiveDepletionAge - retirementAge : 30;
  const moderateLongevity = moderateDepletionAge ? moderateDepletionAge - retirementAge : 30;
  const conservativeLongevity = conservativeDepletionAge ? conservativeDepletionAge - retirementAge : 30;

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
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-sm font-medium flex items-center">
                  Estimated portfolio longevity: 
                  <span className="ml-1 font-bold text-green-600">
                    {conservativeDepletionAge ? `${conservativeLongevity} years` : "30+ years"}
                  </span>
                </p>
              </div>
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
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-sm font-medium flex items-center">
                  Estimated portfolio longevity: 
                  <span className="ml-1 font-bold text-amber-600">
                    {moderateDepletionAge ? `${moderateLongevity} years` : "30+ years"}
                  </span>
                </p>
              </div>
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
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-sm font-medium flex items-center">
                  {aggressiveDepletionAge && aggressiveLongevity < 20 && (
                    <AlertTriangle size={14} className="mr-1 text-red-500" />
                  )}
                  Estimated portfolio longevity: 
                  <span className="ml-1 font-bold text-red-600">
                    {aggressiveDepletionAge ? `${aggressiveLongevity} years` : "30+ years"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <h4 className="font-medium">About Withdrawal Strategies</h4>
            <p>These projections show how different withdrawal rates affect your retirement portfolio over time:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Conservative (3%)</strong>: Prioritizes portfolio longevity over spending power.</li>
              <li><strong>Moderate (4%)</strong>: The traditional "4% rule" offering balance between spending and longevity.</li>
              <li><strong>Aggressive (5%)</strong>: Provides more spending power at the cost of potentially shorter portfolio lifespan.</li>
            </ul>
            <p className="mt-2">All projections account for inflation, meaning your purchasing power should remain consistent over time despite rising prices.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalStrategyTab;
