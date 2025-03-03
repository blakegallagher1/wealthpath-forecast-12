
import { motion } from "framer-motion";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import StatusAlert from "./retirement-summary/StatusAlert";
import SummaryCard from "./retirement-summary/SummaryCard";
import DetailSection from "./retirement-summary/DetailSection";
import { formatSummaryValue } from "./utils/formatters";

interface RetirementSummaryProps {
  plan: RetirementPlan;
  inputs: CalculatorInputs;
}

const RetirementSummary = ({ plan, inputs }: RetirementSummaryProps) => {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <StatusAlert sustainabilityScore={plan.sustainabilityScore} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <SummaryCard
          label="Estimated at Retirement"
          value={formatSummaryValue(plan.totalRetirementSavings)}
          description={`in ${yearsToRetirement} years at age ${inputs.retirementAge}`}
          delay={0.1}
        />

        <SummaryCard
          label="Retirement Income"
          value={formatSummaryValue(plan.estimatedAnnualRetirementIncome)}
          description="estimated annual retirement income"
          delay={0.2}
        />

        <SummaryCard
          label="Plan Sustainability"
          value={plan.portfolioLongevity.toString()}
          description="age when funds may be depleted"
          delay={0.3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm"
      >
        <h3 className="text-lg font-medium mb-4">Retirement Plan Details</h3>
        <DetailSection plan={plan} inputs={inputs} />
      </motion.div>
    </motion.div>
  );
};

export default RetirementSummary;
