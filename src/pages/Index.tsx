
import { Button } from "@/components/ui/button";
import Calculator from "@/components/calculator/Calculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Database } from "lucide-react";
import { useState } from "react";
import { calculatorDefaults } from "@/lib/calculator/defaults";
import { CalculatorInputs } from "@/lib/calculator/types";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    ...calculatorDefaults,
    socialSecurityBenefit: 0,
    spouseSocialSecurityBenefit: 0
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
      
      // Ensure Social Security fields are explicitly set
      socialSecurityBenefit: 0,
      spouseSocialSecurityBenefit: 0,
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
        <div className="flex justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadTestData}
            className="flex items-center gap-1"
          >
            <Database className="h-4 w-4" />
            Load Test Data
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/advisor/login")}
            className="flex items-center gap-1"
          >
            <LockKeyhole className="h-4 w-4" />
            Advisor Login
          </Button>
        </div>
        <Calculator initialInputs={calculatorInputs} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
