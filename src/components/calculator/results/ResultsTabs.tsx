
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { formatCurrency } from "@/lib/calculator/formatters";
import SummaryTab from "../tabs/SummaryTab";
import NetWorthTab from "../tabs/NetWorthTab";
import IncomeSourcesTab from "../tabs/IncomeSourcesTab";
import WithdrawalStrategyTab from "../tabs/WithdrawalStrategyTab";
import RiskProfileTab from "../tabs/RiskProfileTab";
import DebtPayoffTab from "../tabs/DebtPayoffTab";

interface ResultsTabsProps {
  plan: RetirementPlan;
  inputs: CalculatorInputs;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ResultsTabs = ({ plan, inputs, activeTab, setActiveTab }: ResultsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto min-w-max">
          <TabsTrigger value="summary" className="text-xs md:text-sm py-3">Summary</TabsTrigger>
          <TabsTrigger value="networth" className="text-xs md:text-sm py-3">Net Worth</TabsTrigger>
          <TabsTrigger value="income" className="text-xs md:text-sm py-3">Income Sources</TabsTrigger>
          <TabsTrigger value="withdrawal" className="text-xs md:text-sm py-3">Withdrawal Strategy</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs md:text-sm py-3">Risk Analysis</TabsTrigger>
          <TabsTrigger value="debt" className="text-xs md:text-sm py-3">Debt Payoff</TabsTrigger>
        </TabsList>
      </div>

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
  );
};

export default ResultsTabs;
