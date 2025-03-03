
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { calculatorDefaults } from "@/lib/calculator/defaults";
import { calculateRetirementPlan } from "@/lib/calculator/calculations";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { toast } from "@/components/ui/use-toast";
import CalculatorContent from "./CalculatorContent";
import AdvisoryServicesDialog from "./dialogs/AdvisoryServicesDialog";

interface CalculatorProps {
  initialInputs?: CalculatorInputs;
}

const Calculator = ({ initialInputs = calculatorDefaults }: CalculatorProps) => {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [results, setResults] = useState<RetirementPlan | null>(null);
  const [activeTab, setActiveTab] = useState("inputs");
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showAdvisoryDialog, setShowAdvisoryDialog] = useState(false);

  // Update inputs when initialInputs changes (e.g., when test data is loaded)
  useEffect(() => {
    setInputs(initialInputs);
  }, [initialInputs]);
  
  // Check if user qualifies for wealth management services when switching to results tab
  useEffect(() => {
    if (activeTab === "results" && results) {
      const investableAssets = inputs.cashSavings + 
                               inputs.retirementAccounts + 
                               inputs.rothAccounts + 
                               inputs.taxableInvestments;
      
      if (investableAssets > 500000 && !showAdvisoryDialog) {
        setShowAdvisoryDialog(true);
      }
    }
  }, [activeTab, results, inputs, showAdvisoryDialog]);

  const handleInputChange = (newInputs: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...newInputs }));
  };

  const performCalculation = () => {
    try {
      const plan = calculateRetirementPlan(inputs);
      setResults(plan);
      setActiveTab("results");
      toast({
        title: "Calculation complete",
        description: "Your retirement plan has been calculated.",
      });
    } catch (error) {
      toast({
        title: "Calculation failed",
        description: error instanceof Error ? error.message : "Please check your inputs and try again.",
        variant: "destructive",
      });
    }
  };

  const handleCalculate = () => {
    if (isVerified) {
      performCalculation();
    } else {
      setShowVerification(true);
    }
  };

  const handleReset = () => {
    setInputs(calculatorDefaults);
    setResults(null);
    setActiveTab("inputs");
    toast({
      title: "Reset complete",
      description: "All inputs have been reset to default values.",
    });
  };

  const handleVerify = () => {
    setIsVerified(true);
    setShowVerification(false);
    performCalculation();
  };

  const handleCancelVerification = () => {
    setShowVerification(false);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6 pb-3">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="inputs" className="text-sm">Inputs & Assumptions</TabsTrigger>
              <TabsTrigger value="results" className="text-sm" disabled={!results}>Results & Analysis</TabsTrigger>
            </TabsList>
          </div>
          
          <Separator />
          
          <div className="p-6">
            <CalculatorContent
              activeTab={activeTab}
              inputs={inputs}
              results={results}
              showVerification={showVerification}
              handleInputChange={handleInputChange}
              handleCalculate={handleCalculate}
              handleReset={handleReset}
              handleVerify={handleVerify}
              handleCancelVerification={handleCancelVerification}
              setActiveTab={setActiveTab}
            />
          </div>
        </Tabs>
      </motion.div>

      {/* Advisory Services Dialog */}
      <AdvisoryServicesDialog 
        open={showAdvisoryDialog} 
        onOpenChange={setShowAdvisoryDialog} 
      />
    </div>
  );
};

export default Calculator;
