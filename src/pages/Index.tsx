
import { Button } from "@/components/ui/button";
import Calculator from "@/components/calculator/Calculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { calculatorDefaults } from "@/lib/calculator/defaults";
import { CalculatorInputs } from "@/lib/calculator/types";
import { toast } from "@/components/ui/use-toast";
import { Database } from "lucide-react";

const Index = () => {
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    ...calculatorDefaults
  });

  const loadTestData = () => {
    const testData: CalculatorInputs = {
      ...calculatorDefaults,
      // Personal details
      name: "Andy",
      spouseName: "Amidori",
      currentAge: 25,
      retirementAge: 65,
      spouseAge: 25,
      spouseRetirementAge: 50,
      stateOfResidence: "FL",
      
      // Income & expenses
      annualIncome: 95000,
      spouseIncome: 50000,
      
      // Assets & investments
      cashSavings: 5000,
      retirementAccounts: 0,
      rothAccounts: 70000,
      taxableInvestments: 3000,
      realEstateEquity: 0,
      annual401kContribution: 0,
      
      // Set debt balances to zero
      mortgageBalance: 0,
      autoLoanBalance: 0,
      creditCardBalance: 0,
      
      // Add life events
      planningWedding: true,
      weddingYear: 2028,
      weddingCost: 25000,
      
      planningHomePurchase: true,
      homePurchaseYear: 2030,
      homeDownPayment: 75000,
    };
    
    setCalculatorInputs(testData);
    toast({
      title: "Test data loaded",
      description: "Calculator has been pre-filled with test data.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadTestData}
            className="flex items-center gap-1"
          >
            <Database className="h-4 w-4" />
            Load Test Data
          </Button>
        </div>
        <Calculator initialInputs={calculatorInputs} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
