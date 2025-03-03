
import { useState } from "react";
import { motion } from "framer-motion";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import RetirementSummary from "./RetirementSummary";
import ResultsTabs from "./results/ResultsTabs";
import ActionButtons from "./results/ActionButtons";
import CalculatorAssumptions from "./results/CalculatorAssumptions";

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

      <ResultsTabs 
        plan={plan} 
        inputs={inputs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {activeTab === "summary" && <CalculatorAssumptions />}

      <ActionButtons 
        onRecalculate={onRecalculate} 
        onSendEmail={handleSendEmail} 
      />
    </div>
  );
};

export default Results;
