
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InputForm from "./InputForm";
import Results from "./Results";
import PhoneVerification from "./PhoneVerification";
import Questionnaire from "./Questionnaire";
import { calculatorDefaults } from "@/lib/calculator/defaults";
import { calculateRetirementPlan } from "@/lib/calculator/calculations";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClipboardList, ExternalLink, FormInput } from "lucide-react";

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
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

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

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = (questionnaireInputs: CalculatorInputs) => {
    setInputs(questionnaireInputs);
    setShowQuestionnaire(false);
    
    // Automatically calculate after completing questionnaire
    try {
      const plan = calculateRetirementPlan(questionnaireInputs);
      setResults(plan);
      setActiveTab("results");
      toast({
        title: "Questionnaire complete",
        description: "Your retirement plan has been calculated based on your answers.",
      });
    } catch (error) {
      toast({
        title: "Calculation failed",
        description: error instanceof Error ? error.message : "There was an issue with some of your answers. Please review your inputs.",
        variant: "destructive",
      });
    }
  };

  const handleCancelQuestionnaire = () => {
    setShowQuestionnaire(false);
    toast({
      description: "Questionnaire cancelled. You can start again anytime.",
    });
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
              ) : showQuestionnaire ? (
                <motion.div
                  key="questionnaire"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Questionnaire
                    onComplete={handleQuestionnaireComplete}
                    onCancel={handleCancelQuestionnaire}
                    initialInputs={inputs}
                  />
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
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
                      <Button 
                        onClick={handleStartQuestionnaire}
                        variant="outline"
                        size="lg"
                        className="w-full flex items-center justify-center gap-2 h-16 border-2 hover:bg-blue-50"
                      >
                        <ClipboardList className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Fill Out Questionnaire</span>
                          <span className="text-xs text-left font-normal">Simple guided questions</span>
                        </div>
                      </Button>
                      
                      <span className="hidden sm:flex items-center text-neutral-500">or</span>
                      
                      <Button 
                        variant="outline"
                        size="lg"
                        className="w-full flex items-center justify-center gap-2 h-16 border-2 bg-blue-50 border-blue-200"
                        disabled
                      >
                        <FormInput className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Manual Input Dashboard</span>
                          <span className="text-xs text-left font-normal">Advanced options</span>
                        </div>
                      </Button>
                    </div>
                    
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

      {/* Advisory Services Dialog */}
      <Dialog open={showAdvisoryDialog} onOpenChange={setShowAdvisoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">You Qualify for Premium Advisory Services</DialogTitle>
            <DialogDescription className="text-center pt-2">
              It seems you have the minimum assets necessary to qualify for the financial advisory services of the Hoffman Private Wealth Group. Would you like to speak with an expert?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Our wealth management experts can provide personalized guidance to help optimize your retirement strategy and maximize your financial potential.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full"
              onClick={() => window.open("https://todd-hoffman.stewardpartners.com/", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Learn More
            </Button>
            <Button 
              className="flex items-center gap-2 w-full"
              onClick={() => window.open("https://calendly.com/andy-hoffman-stewardpartners/15min", "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Schedule a Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calculator;
