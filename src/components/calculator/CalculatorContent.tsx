
import { motion, AnimatePresence } from "framer-motion";
import InputForm from "./InputForm";
import Results from "./Results";
import VerificationScreen from "./VerificationScreen";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import InputDashboard from "./InputDashboard";
import { Button } from "@/components/ui/button";

interface CalculatorContentProps {
  activeTab: string;
  inputs: CalculatorInputs;
  results: RetirementPlan | null;
  showVerification: boolean;
  handleInputChange: (newInputs: Partial<CalculatorInputs>) => void;
  handleCalculate: () => void;
  handleReset: () => void;
  handleVerify: () => void;
  handleCancelVerification: () => void;
  setActiveTab: (tab: string) => void;
}

const CalculatorContent = ({
  activeTab,
  inputs,
  results,
  showVerification,
  handleInputChange,
  handleCalculate,
  handleReset,
  handleVerify,
  handleCancelVerification,
  setActiveTab
}: CalculatorContentProps) => {
  return (
    <AnimatePresence mode="wait">
      {showVerification ? (
        <VerificationScreen
          onVerify={handleVerify}
          onCancel={handleCancelVerification}
        />
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "inputs" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === "inputs" ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "inputs" && (
            <div className="space-y-4 sm:space-y-6">
              <InputDashboard />
              <InputForm inputs={inputs} onChange={handleInputChange} />
              <div className="mt-8 flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="px-4 sm:px-6"
                >
                  Reset
                </Button>
                <Button 
                  onClick={handleCalculate}
                  className="px-6 sm:px-8"
                >
                  Calculate
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "results" && results && (
            <Results 
              plan={results} 
              inputs={inputs} 
              onRecalculate={() => setActiveTab("inputs")} 
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalculatorContent;
