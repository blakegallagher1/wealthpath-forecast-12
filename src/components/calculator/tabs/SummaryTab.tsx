
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import ResultInfoCard from "../ResultInfoCard";

interface SummaryTabProps {
  plan: RetirementPlan;
  inputs: CalculatorInputs;
  formatCurrency: (amount: number) => string;
}

const SummaryTab = ({ plan, inputs, formatCurrency }: SummaryTabProps) => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="px-3 sm:px-6 pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-2xl">Retirement Plan Summary</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Overview of your retirement plan and key metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <ResultInfoCard 
            title="Retirement Age" 
            value={inputs.retirementAge.toString()} 
            description="Your planned retirement age"
          />
          <ResultInfoCard 
            title="Retirement Savings" 
            value={formatCurrency(plan.totalRetirementSavings)} 
            description="Projected savings at retirement"
          />
          <ResultInfoCard 
            title="Retirement Income" 
            value={formatCurrency(plan.estimatedAnnualRetirementIncome)} 
            description="Estimated annual income in retirement"
          />
          <ResultInfoCard 
            title="Sustainability Score" 
            value={`${plan.sustainabilityScore}/100`} 
            description="How sustainable your plan is"
            emphasis={plan.sustainabilityScore >= 80 ? "positive" : plan.sustainabilityScore >= 60 ? "neutral" : "negative"}
          />
          <ResultInfoCard 
            title="Success Probability" 
            value={`${plan.successProbability}%`} 
            description="Likelihood your money will last"
            emphasis={plan.successProbability >= 80 ? "positive" : plan.successProbability >= 60 ? "neutral" : "negative"}
          />
          <ResultInfoCard 
            title="Longevity" 
            value={`Age ${plan.portfolioLongevity}`} 
            description="How long your money is expected to last"
            emphasis={plan.portfolioLongevity >= inputs.lifeExpectancy ? "positive" : "negative"}
          />
        </div>
        
        <div className="mt-4 sm:mt-8 space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-medium">Recommendations</h3>
          <ul className="space-y-1.5 sm:space-y-2 list-disc pl-4 sm:pl-5">
            {plan.recommendations.map((rec, index) => (
              <li key={index} className="text-neutral-700 text-xs sm:text-base">{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryTab;
