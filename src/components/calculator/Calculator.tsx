
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InputForm from "./InputForm";
import Results from "./Results";
import PhoneVerification from "./PhoneVerification";
import { calculatorDefaults } from "@/lib/calculator/defaults";
import { calculateRetirementPlan } from "@/lib/calculator/calculations";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { toast } from "@/components/ui/use-toast";

const Calculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(calculatorDefaults);
  const [results, setResults] = useState<RetirementPlan | null>(null);
  const [activeTab, setActiveTab] = useState("inputs");
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

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
            <AnimatePresence mode="wait">
              {showVerification ? (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="py-4"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-center">One More Step</h2>
                    <p className="text-center text-neutral-600 mt-2">
                      Please verify your phone number to calculate your retirement plan.
                    </p>
                  </div>
                  <PhoneVerification onVerify={handleVerify} />
                  <div className="mt-6 text-center">
                    <Button variant="link" onClick={handleCancelVerification}>
                      Return to calculator
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "inputs" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "inputs" ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="inputs" className="mt-0">
                    <InputForm inputs={inputs} onChange={handleInputChange} />
                    <div className="mt-8 flex justify-end space-x-4">
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="px-6"
                      >
                        Reset
                      </Button>
                      <Button 
                        onClick={handleCalculate}
                        className="px-8"
                      >
                        Calculate
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="results" className="mt-0">
                    {results && (
                      <Results 
                        plan={results} 
                        inputs={inputs} 
                        onRecalculate={() => setActiveTab("inputs")} 
                      />
                    )}
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Calculator;
