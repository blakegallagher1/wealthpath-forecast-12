
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import NetWorthChart from "./charts/NetWorthChart";
import IncomeSourcesChart from "./charts/IncomeSourcesChart";
import SocialSecurityChart from "./charts/SocialSecurityChart";
import WithdrawalStrategyChart from "./charts/WithdrawalStrategyChart";
import RiskProfileChart from "./charts/RiskProfileChart";
import RetirementSummary from "./RetirementSummary";
import { motion } from "framer-motion";

interface ResultsProps {
  plan: RetirementPlan;
  inputs: CalculatorInputs;
  onRecalculate: () => void;
}

const Results = ({ plan, inputs, onRecalculate }: ResultsProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  const handleSendEmail = () => {
    // This would be implemented with a backend service
    alert("This feature would email the results to your financial advisor.");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RetirementSummary plan={plan} inputs={inputs} />
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-12">
          <TabsTrigger value="summary" className="text-xs md:text-sm">Summary</TabsTrigger>
          <TabsTrigger value="networth" className="text-xs md:text-sm">Net Worth</TabsTrigger>
          <TabsTrigger value="income" className="text-xs md:text-sm">Income Sources</TabsTrigger>
          <TabsTrigger value="withdrawal" className="text-xs md:text-sm">Withdrawal Strategy</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs md:text-sm">Risk Analysis</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="summary" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Plan Summary</CardTitle>
                  <CardDescription>
                    Overview of your retirement plan and key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoCard 
                      title="Retirement Age" 
                      value={inputs.retirementAge.toString()} 
                      description="Your planned retirement age"
                    />
                    <InfoCard 
                      title="Retirement Savings" 
                      value={`$${formatNumber(plan.totalRetirementSavings)}`} 
                      description="Projected savings at retirement"
                    />
                    <InfoCard 
                      title="Retirement Income" 
                      value={`$${formatNumber(plan.estimatedAnnualRetirementIncome)}`} 
                      description="Estimated annual income in retirement"
                    />
                    <InfoCard 
                      title="Sustainability Score" 
                      value={`${plan.sustainabilityScore}/100`} 
                      description="How sustainable your plan is"
                      emphasis={plan.sustainabilityScore >= 80 ? "positive" : plan.sustainabilityScore >= 60 ? "neutral" : "negative"}
                    />
                    <InfoCard 
                      title="Success Probability" 
                      value={`${plan.successProbability}%`} 
                      description="Likelihood your money will last"
                      emphasis={plan.successProbability >= 80 ? "positive" : plan.successProbability >= 60 ? "neutral" : "negative"}
                    />
                    <InfoCard 
                      title="Longevity" 
                      value={`Age ${plan.portfolioLongevity}`} 
                      description="How long your money is expected to last"
                      emphasis={plan.portfolioLongevity >= inputs.lifeExpectancy ? "positive" : "negative"}
                    />
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-medium">Recommendations</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      {plan.recommendations.map((rec, index) => (
                        <li key={index} className="text-neutral-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="networth" className="mt-0">
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
            </TabsContent>

            <TabsContent value="income" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Income Sources Through Retirement</CardTitle>
                  <CardDescription>
                    Visualizing the transition from working income to retirement income
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <IncomeSourcesChart data={plan.incomeSourcesData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdrawal" className="mt-0">
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
            </TabsContent>

            <TabsContent value="risk" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Profile Comparison</CardTitle>
                  <CardDescription>
                    Projected portfolio growth under different risk profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <RiskProfileChart data={plan.riskProfileData} />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Social Security Benefits</CardTitle>
                  <CardDescription>
                    Projected social security benefits at different claiming ages
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <SocialSecurityChart data={plan.socialSecurityData} />
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </div>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
        <Button onClick={onRecalculate} variant="outline">
          Adjust Inputs
        </Button>
        <div className="flex space-x-4">
          <Button onClick={handleSendEmail} variant="outline">
            Email Results
          </Button>
          <Button>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  value: string;
  description: string;
  emphasis?: "positive" | "neutral" | "negative";
}

const InfoCard = ({ title, value, description, emphasis }: InfoCardProps) => {
  const getValueColorClass = () => {
    switch (emphasis) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "neutral":
        return "text-amber-600";
      default:
        return "text-neutral-900";
    }
  };

  return (
    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className={`text-xl font-medium mt-1 ${getValueColorClass()}`}>{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{description}</div>
    </div>
  );
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(num);
};

export default Results;
