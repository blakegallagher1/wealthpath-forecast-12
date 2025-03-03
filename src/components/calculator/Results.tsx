
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { motion } from "framer-motion";
import RetirementSummary from "./RetirementSummary";
import SummaryTab from "./tabs/SummaryTab";
import NetWorthTab from "./tabs/NetWorthTab";
import IncomeSourcesTab from "./tabs/IncomeSourcesTab";
import WithdrawalStrategyTab from "./tabs/WithdrawalStrategyTab";
import RiskProfileTab from "./tabs/RiskProfileTab";
import DebtPayoffTab from "./tabs/DebtPayoffTab";
import { formatCurrency } from "@/lib/calculator/formatters";

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
        <TabsList className="grid grid-cols-2 md:grid-cols-6 h-12">
          <TabsTrigger value="summary" className="text-xs md:text-sm">Summary</TabsTrigger>
          <TabsTrigger value="networth" className="text-xs md:text-sm">Net Worth</TabsTrigger>
          <TabsTrigger value="income" className="text-xs md:text-sm">Income Sources</TabsTrigger>
          <TabsTrigger value="withdrawal" className="text-xs md:text-sm">Withdrawal Strategy</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs md:text-sm">Risk Analysis</TabsTrigger>
          <TabsTrigger value="debt" className="text-xs md:text-sm">Debt Payoff</TabsTrigger>
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
              <SummaryTab plan={plan} inputs={inputs} formatCurrency={formatCurrency} />
            </TabsContent>

            <TabsContent value="networth" className="mt-0">
              <NetWorthTab plan={plan} />
            </TabsContent>

            <TabsContent value="income" className="mt-0">
              <IncomeSourcesTab plan={plan} />
            </TabsContent>

            <TabsContent value="withdrawal" className="mt-0">
              <WithdrawalStrategyTab plan={plan} />
            </TabsContent>

            <TabsContent value="risk" className="mt-0">
              <RiskProfileTab plan={plan} />
            </TabsContent>

            <TabsContent value="debt" className="mt-0">
              <DebtPayoffTab plan={plan} />
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

export default Results;
