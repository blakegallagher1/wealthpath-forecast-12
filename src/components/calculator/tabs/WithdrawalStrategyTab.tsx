
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
  const aggressiveLongevity = calculateLongevity(aggressiveDepletionAge, retirementAge);
  const moderateLongevity = calculateLongevity(moderateDepletionAge, retirementAge);
  const conservativeLongevity = calculateLongevity(conservativeDepletionAge, retirementAge);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-2xl">Withdrawal Strategy Analysis</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Comparison of different withdrawal rates and their impact on portfolio longevity
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1 w-fit text-xs">
              <Info className="h-3 w-3" />
              <span>Adjusted for Inflation</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[400px] px-2 sm:px-6 pt-0">
          <WithdrawalStrategyChart data={plan.withdrawalStrategyData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="shadow-sm">
          <CardHeader className="px-3 sm:px-4 py-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              Conservative Strategy (3%)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pt-0">
            <div className="space-y-1">
              <p className="text-lg sm:text-2xl font-bold">
                {formatSummaryValue(initialWithdrawals.conservative, 0)}
                <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">/ year</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Lower withdrawal rate for longer-lasting portfolio.
              </p>
              <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-border">
                <p className="text-xs sm:text-sm font-medium flex items-center flex-wrap">
                  Est. portfolio longevity: 
                  <span className="ml-1 font-bold text-green-600">
                    {conservativeDepletionAge ? `${conservativeLongevity} years` : "30+ years"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="px-3 sm:px-4 py-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              Moderate Strategy (4%)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pt-0">
            <div className="space-y-1">
              <p className="text-lg sm:text-2xl font-bold">
                {formatSummaryValue(initialWithdrawals.moderate, 0)}
                <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">/ year</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Traditional "4% rule" balancing longevity and spending.
              </p>
              <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-border">
                <p className="text-xs sm:text-sm font-medium flex items-center flex-wrap">
                  Est. portfolio longevity: 
                  <span className="ml-1 font-bold text-amber-600">
                    {moderateDepletionAge ? `${moderateLongevity} years` : "30+ years"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="px-3 sm:px-4 py-2 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
              Aggressive Strategy (5%)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pt-0">
            <div className="space-y-1">
              <p className="text-lg sm:text-2xl font-bold">
                {formatSummaryValue(initialWithdrawals.aggressive, 0)}
                <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">/ year</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Higher withdrawal rate but shorter portfolio lifespan.
              </p>
              <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-border">
                <p className="text-xs sm:text-sm font-medium flex items-center flex-wrap">
                  {aggressiveDepletionAge && aggressiveLongevity < 20 && (
                    <AlertTriangle size={12} className="mr-1 text-red-500" />
                  )}
                  Est. portfolio longevity: 
                  <span className="ml-1 font-bold text-red-600">
                    {aggressiveDepletionAge ? `${aggressiveLongevity} years` : "30+ years"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50 shadow-sm">
        <CardContent className="pt-3 sm:pt-6 px-3 sm:px-6">
          <div className="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
            <h4 className="font-medium">About Withdrawal Strategies</h4>
            <p>These projections show how different withdrawal rates affect your retirement portfolio:</p>
            <ul className="list-disc pl-4 sm:pl-5 space-y-1">
              <li><strong>Conservative (3%)</strong>: Prioritizes portfolio longevity.</li>
              <li><strong>Moderate (4%)</strong>: The traditional "4% rule" balancing spending and longevity.</li>
              <li><strong>Aggressive (5%)</strong>: More spending power at cost of shorter portfolio life.</li>
            </ul>
            <p className="mt-1.5 sm:mt-2">All projections account for inflation, maintaining your purchasing power over time.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalStrategyTab;
