
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CalculatorInputs } from "@/lib/calculator/types";
import { calculatorDefaults } from "@/lib/calculator/defaults";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  InfoIcon 
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

interface QuestionnaireProps {
  onComplete: (inputs: CalculatorInputs) => void;
  onCancel: () => void;
  initialInputs: CalculatorInputs;
}

interface Question {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  updateInputs: (value: any, currentInputs: CalculatorInputs) => CalculatorInputs;
}

const Questionnaire = ({ onComplete, onCancel, initialInputs }: QuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [progress, setProgress] = useState(0);

  // Helper function to handle input changes
  const updateInputs = (questionId: string, value: any) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const updatedInputs = question.updateInputs(value, inputs);
      setInputs(updatedInputs);
    }
  };

  // Define all questions
  const questions: Question[] = [
    {
      id: "personal",
      title: "Let's begin. Are you married?",
      description: "This takes about five minutes. A personalized PDF will be emailed to you—no phone number needed, just an email.",
      component: (
        <RadioGroup 
          value={inputs.spouseName ? "married" : "single"}
          onValueChange={(value) => updateInputs("personal", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="married" id="married" />
            <Label htmlFor="married" className="flex-1 cursor-pointer">Yes, I'm married</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single" className="flex-1 cursor-pointer">No (or I'd like to run a plan just for me)</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="partner" id="partner" />
            <Label htmlFor="partner" className="flex-1 cursor-pointer">Not legally, but let's treat it that way</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        if (value === "single") {
          return { ...currentInputs, spouseName: "", spouseIncome: 0, spouseAge: 0, spouseRetirementAge: 0 };
        } else if (value === "married" || value === "partner") {
          return { ...currentInputs, spouseName: currentInputs.spouseName || "Spouse" };
        }
        return currentInputs;
      }
    },
    {
      id: "names",
      title: "What is your first name?",
      description: "(we won't ask for your last name)",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Your first name:</Label>
            <Input 
              id="firstName" 
              value={inputs.name || ""} 
              onChange={(e) => updateInputs("names", { name: e.target.value, spouseName: inputs.spouseName })}
              placeholder="Your name"
            />
          </div>
          {(inputs.spouseName !== undefined && inputs.spouseName !== "") && (
            <div className="space-y-2">
              <Label htmlFor="spouseName">Your spouse / significant other's first name:</Label>
              <Input 
                id="spouseName" 
                value={inputs.spouseName} 
                onChange={(e) => updateInputs("names", { name: inputs.name, spouseName: e.target.value })}
                placeholder="Spouse/partner name"
              />
            </div>
          )}
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        return { 
          ...currentInputs, 
          name: value.name || currentInputs.name,
          spouseName: value.spouseName
        };
      }
    },
    {
      id: "age",
      title: "How old are you?",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age">Enter your age here:</Label>
            <Input 
              id="age" 
              type="number"
              min={18}
              max={120}
              value={inputs.currentAge || ""}
              onChange={(e) => {
                const age = parseInt(e.target.value);
                updateInputs("age", { age, spouseAge: inputs.spouseAge });
              }}
            />
          </div>
          {(inputs.spouseName !== undefined && inputs.spouseName !== "") && (
            <div className="space-y-2">
              <Label htmlFor="spouseAge">Enter {inputs.spouseName}'s age here:</Label>
              <Input 
                id="spouseAge" 
                type="number"
                min={18}
                max={120}
                value={inputs.spouseAge || ""}
                onChange={(e) => {
                  const spouseAge = parseInt(e.target.value);
                  updateInputs("age", { age: inputs.currentAge, spouseAge });
                }}
              />
            </div>
          )}
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        return { 
          ...currentInputs, 
          currentAge: value.age || currentInputs.currentAge,
          spouseAge: value.spouseAge || currentInputs.spouseAge
        };
      }
    },
    {
      id: "retirement",
      title: "Is your household retired?",
      component: (
        <RadioGroup 
          value={inputs.currentAge >= inputs.retirementAge ? "yes" : "no"}
          onValueChange={(value) => updateInputs("retirement", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="no" id="not-retired" />
            <Label htmlFor="not-retired" className="flex-1 cursor-pointer">No</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="yes" id="is-retired" />
            <Label htmlFor="is-retired" className="flex-1 cursor-pointer">Yes, retired</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        if (value === "yes") {
          // If retired, set retirement age to current age
          return { 
            ...currentInputs, 
            retirementAge: currentInputs.currentAge,
            spouseRetirementAge: currentInputs.spouseAge
          };
        } else {
          // If not retired, set default retirement ages if they're lower than current age
          const retirementAge = currentInputs.retirementAge <= currentInputs.currentAge ? 65 : currentInputs.retirementAge;
          const spouseRetirementAge = currentInputs.spouseRetirementAge <= currentInputs.spouseAge ? 65 : currentInputs.spouseRetirementAge;
          return { ...currentInputs, retirementAge, spouseRetirementAge };
        }
      }
    },
    {
      id: "children",
      title: "Does your household have children?",
      description: "(of any age)",
      component: (
        <RadioGroup 
          value={inputs.planningChildren ? "yes" : "no"}
          onValueChange={(value) => updateInputs("children", value)}
          className="space-y-3 grid grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="yes" id="has-children" />
            <Label htmlFor="has-children" className="flex-1 cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="no" id="no-children" />
            <Label htmlFor="no-children" className="flex-1 cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        return { ...currentInputs, planningChildren: value === "yes" };
      }
    },
    {
      id: "debt",
      title: "What do you think about debt?",
      component: (
        <RadioGroup 
          value={inputs.creditCardBalance > 0 ? "comfortable" : "debt-free"}
          onValueChange={(value) => updateInputs("debt", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="comfortable" id="comfortable-debt" />
            <Label htmlFor="comfortable-debt" className="flex-1 cursor-pointer">I'm comfortable with strategic debt</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="debt-free" id="debt-free" />
            <Label htmlFor="debt-free" className="flex-1 cursor-pointer">I would prefer to be debt-free</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        return currentInputs;
      }
    },
    {
      id: "credit-score",
      title: "What is your credit score?",
      component: (
        <RadioGroup 
          value={inputs.creditCardBalance === 0 ? "excellent" : "good"}
          onValueChange={(value) => updateInputs("credit-score", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="excellent" id="excellent" />
            <Label htmlFor="excellent" className="flex-1 cursor-pointer">Excellent (780+)</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="good" id="good" />
            <Label htmlFor="good" className="flex-1 cursor-pointer">Good (700-780)</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="average" id="average" />
            <Label htmlFor="average" className="flex-1 cursor-pointer">Average (600-700)</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="below-average" id="below-average" />
            <Label htmlFor="below-average" className="flex-1 cursor-pointer">Below average (&lt;600)</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="unknown" id="unknown" />
            <Label htmlFor="unknown" className="flex-1 cursor-pointer">I don't know</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        return currentInputs;
      }
    },
    {
      id: "income",
      title: "How much is your total annual household income?",
      description: "Complicated? Learn more:",
      component: (
        <div className="space-y-6">
          <RadioGroup 
            value={inputs.annualIncome < 250000 ? "under250k" : "over250k"}
            onValueChange={(value) => updateInputs("income", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted bg-blue-50">
              <RadioGroupItem value="under250k" id="under250k" />
              <Label htmlFor="under250k" className="flex-1 cursor-pointer">Less than $250,000 per year</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
              <RadioGroupItem value="over250k" id="over250k" />
              <Label htmlFor="over250k" className="flex-1 cursor-pointer">More than $250,000 per year (excluding passive sources)</Label>
            </div>
          </RadioGroup>
          
          <div className="pt-2">
            <div className="text-center pb-3">
              <div className="mb-3">Approximately how much is your total annual household income?</div>
              <div className="text-xs text-muted-foreground">(excluding investment or rental income)</div>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between text-sm">
                <span>30,000 (or lower)</span>
                <span className="font-medium">$ {inputs.annualIncome.toLocaleString()}</span>
                <span>$250,000</span>
              </div>
              
              <Slider
                value={[inputs.annualIncome]}
                min={30000}
                max={250000}
                step={5000}
                onValueChange={(values) => updateInputs("income-slider", values[0])}
                className="py-4"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30</span>
                <span>50</span>
                <span>70</span>
                <span>90</span>
                <span>110</span>
                <span>130</span>
                <span>150</span>
                <span>170</span>
                <span>190</span>
                <span>210</span>
                <span>230</span>
                <span>250</span>
              </div>
            </div>
          </div>
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        if (value === "income-slider") {
          return { ...currentInputs, annualIncome: value };
        }
        return currentInputs;
      }
    },
    {
      id: "savings",
      title: "What percent of your income do you save?",
      component: (
        <RadioGroup 
          value={inputs.annualRothContribution + inputs.annual401kContribution < inputs.annualIncome * 0.04 ? "zero" : 
                inputs.annualRothContribution + inputs.annual401kContribution < inputs.annualIncome * 0.11 ? "moderate" : "high"}
          onValueChange={(value) => updateInputs("savings", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="zero" id="zero-savings" />
            <Label htmlFor="zero-savings" className="flex-1 cursor-pointer">Zero / I'm not saving</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="low" id="low-savings" />
            <Label htmlFor="low-savings" className="flex-1 cursor-pointer">1 - 3%</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="moderate" id="moderate-savings" />
            <Label htmlFor="moderate-savings" className="flex-1 cursor-pointer">4 - 10%</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="good" id="good-savings" />
            <Label htmlFor="good-savings" className="flex-1 cursor-pointer">11 - 15%</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="high" id="high-savings" />
            <Label htmlFor="high-savings" className="flex-1 cursor-pointer">15% or more</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        const annualIncome = currentInputs.annualIncome;
        let annual401kContribution = 0;
        let annualRothContribution = 0;
        
        switch(value) {
          case "zero":
            // No contributions
            break;
          case "low":
            annual401kContribution = Math.round(annualIncome * 0.02);
            break;
          case "moderate":
            annual401kContribution = Math.round(annualIncome * 0.05);
            annualRothContribution = Math.round(annualIncome * 0.02);
            break;
          case "good":
            annual401kContribution = Math.round(annualIncome * 0.08);
            annualRothContribution = Math.round(annualIncome * 0.04);
            break;
          case "high":
            annual401kContribution = Math.round(annualIncome * 0.10);
            annualRothContribution = Math.round(annualIncome * 0.05);
            break;
        }
        
        return { 
          ...currentInputs, 
          annual401kContribution, 
          annualRothContribution 
        };
      }
    },
    {
      id: "cash-savings",
      title: "How much do you typically keep in your checking and savings accounts?",
      component: (
        <RadioGroup 
          value={inputs.cashSavings < 1000 ? "under1k" : 
                inputs.cashSavings < 4000 ? "1k-4k" :
                inputs.cashSavings < 10000 ? "4k-10k" : "over10k"}
          onValueChange={(value) => updateInputs("cash-savings", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="under1k" id="under1k" />
            <Label htmlFor="under1k" className="flex-1 cursor-pointer">Less than $1,000 / I'm paycheck to paycheck</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="1k-4k" id="1k-4k" />
            <Label htmlFor="1k-4k" className="flex-1 cursor-pointer">$1,000 to $4,000</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="4k-10k" id="4k-10k" />
            <Label htmlFor="4k-10k" className="flex-1 cursor-pointer">$4,000 to $10,000</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="over10k" id="over10k" />
            <Label htmlFor="over10k" className="flex-1 cursor-pointer">$10,000 or more</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        let cashSavings = 0;
        
        switch(value) {
          case "under1k":
            cashSavings = 500;
            break;
          case "1k-4k":
            cashSavings = 2500;
            break;
          case "4k-10k":
            cashSavings = 7000;
            break;
          case "over10k":
            cashSavings = 15000;
            break;
        }
        
        return { ...currentInputs, cashSavings };
      }
    },
    {
      id: "credit-card-debt",
      title: "How much do you have in credit card debt?",
      component: (
        <RadioGroup 
          value={inputs.creditCardBalance === 0 ? "zero" :
                inputs.creditCardBalance < 5000 ? "under5k" :
                inputs.creditCardBalance < 10000 ? "5k-10k" :
                inputs.creditCardBalance < 20000 ? "10k-20k" : "over20k"}
          onValueChange={(value) => updateInputs("credit-card-debt", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="zero" id="zero-cc" />
            <Label htmlFor="zero-cc" className="flex-1 cursor-pointer">Zero - I pay in full each month</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="under5k" id="under5k" />
            <Label htmlFor="under5k" className="flex-1 cursor-pointer">$1,000 to $5,000</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="5k-10k" id="5k-10k" />
            <Label htmlFor="5k-10k" className="flex-1 cursor-pointer">$5,000 to $10,000</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="10k-20k" id="10k-20k" />
            <Label htmlFor="10k-20k" className="flex-1 cursor-pointer">$10,000 to $20,000</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="over20k" id="over20k" />
            <Label htmlFor="over20k" className="flex-1 cursor-pointer">More than $20,000</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        let creditCardBalance = 0;
        
        switch(value) {
          case "zero":
            creditCardBalance = 0;
            break;
          case "under5k":
            creditCardBalance = 3000;
            break;
          case "5k-10k":
            creditCardBalance = 7500;
            break;
          case "10k-20k":
            creditCardBalance = 15000;
            break;
          case "over20k":
            creditCardBalance = 25000;
            break;
        }
        
        return { ...currentInputs, creditCardBalance };
      }
    },
    {
      id: "investments",
      title: "Excluding your home and cash, approximately how much does your household have in investments?",
      description: "(all investments of any type)",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <span className="bg-yellow-200 px-1">Excluding your home and cash,</span>
          </div>
          
          <div className="pt-2">
            <div className="text-center pb-3">
              <div className="mb-3">Approximately how much does your household have in investments?</div>
              <div className="text-xs text-muted-foreground">(all investments of any type)</div>
              <div className="text-xs text-muted-foreground">IRA, 401K, investment accounts...</div>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between text-sm">
                <span>$0</span>
                <span className="font-medium">$ {(inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments).toLocaleString()}</span>
                <span>$100,000</span>
              </div>
              
              <Slider
                value={[inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments]}
                min={0}
                max={100000}
                step={1000}
                onValueChange={(values) => updateInputs("investments-slider", values[0])}
                className="py-4"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
                <span>60</span>
                <span>70</span>
                <span>80</span>
                <span>90</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        if (typeof value === "number") {
          // Split the investment amount between different accounts
          const retirementAccounts = Math.round(value * 0.4);
          const rothAccounts = Math.round(value * 0.3);
          const taxableInvestments = Math.round(value * 0.3);
          
          return { 
            ...currentInputs, 
            retirementAccounts,
            rothAccounts,
            taxableInvestments
          };
        }
        return currentInputs;
      }
    },
    {
      id: "retirement-age",
      title: "At what age do you plan to stop working?",
      component: (
        <RadioGroup 
          value={inputs.retirementAge <= 60 ? "early" : 
                inputs.retirementAge <= 70 ? "normal" : "late"}
          onValueChange={(value) => updateInputs("retirement-age", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="early" id="early-retirement" />
            <Label htmlFor="early-retirement" className="flex-1 cursor-pointer">around 60 years old (or earlier)</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="normal" id="normal-retirement" />
            <Label htmlFor="normal-retirement" className="flex-1 cursor-pointer">sometime between 60 and 70 years old</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="late" id="late-retirement" />
            <Label htmlFor="late-retirement" className="flex-1 cursor-pointer">around 70 years old (or older)</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        let retirementAge = currentInputs.retirementAge;
        let spouseRetirementAge = currentInputs.spouseRetirementAge;
        
        switch(value) {
          case "early":
            retirementAge = 60;
            spouseRetirementAge = 60;
            break;
          case "normal":
            retirementAge = 65;
            spouseRetirementAge = 65;
            break;
          case "late":
            retirementAge = 70;
            spouseRetirementAge = 70;
            break;
        }
        
        return { ...currentInputs, retirementAge, spouseRetirementAge };
      }
    },
    {
      id: "health",
      title: "How is your overall health?",
      component: (
        <RadioGroup 
          value="good"
          onValueChange={(value) => updateInputs("health", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="excellent" id="excellent-health" />
            <Label htmlFor="excellent-health" className="flex-1 cursor-pointer">Excellent</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="good" id="good-health" />
            <Label htmlFor="good-health" className="flex-1 cursor-pointer">Good</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="fair" id="fair-health" />
            <Label htmlFor="fair-health" className="flex-1 cursor-pointer">Fair</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="poor" id="poor-health" />
            <Label htmlFor="poor-health" className="flex-1 cursor-pointer">Poor</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        let lifeExpectancy = 90;
        
        switch(value) {
          case "excellent":
            lifeExpectancy = 95;
            break;
          case "good":
            lifeExpectancy = 90;
            break;
          case "fair":
            lifeExpectancy = 85;
            break;
          case "poor":
            lifeExpectancy = 80;
            break;
        }
        
        return { ...currentInputs, lifeExpectancy };
      }
    },
    {
      id: "spouse-health",
      title: `And ${inputs.spouseName || "your spouse"}'s health?`,
      component: (
        <RadioGroup 
          value="good"
          onValueChange={(value) => updateInputs("spouse-health", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="excellent" id="spouse-excellent-health" />
            <Label htmlFor="spouse-excellent-health" className="flex-1 cursor-pointer">Excellent</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="good" id="spouse-good-health" />
            <Label htmlFor="spouse-good-health" className="flex-1 cursor-pointer">Good</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="fair" id="spouse-fair-health" />
            <Label htmlFor="spouse-fair-health" className="flex-1 cursor-pointer">Fair</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="poor" id="spouse-poor-health" />
            <Label htmlFor="spouse-poor-health" className="flex-1 cursor-pointer">Poor</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        return currentInputs;
      }
    },
    {
      id: "financial-stress",
      title: "Rate your financial stress.",
      description: "How much do you worry about money?",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">0 = None | 10 = A lot</div>
            <div className="text-sm text-muted-foreground">Slide & hit "next"</div>
          </div>
          
          <div className="pt-4 space-y-8">
            <div className="flex justify-between text-sm">
              <span>0 - No stress</span>
              <span>10 - High stress</span>
            </div>
            
            <div className="px-8">
              <div className="bg-gray-200 h-1 relative">
                <Slider
                  value={[5]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(values) => updateInputs("stress-level", values[0])}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
          </div>
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        return currentInputs;
      }
    },
    {
      id: "retirement-income",
      title: "It looks like your household would like about $10,000 per month (after taxes) to live on without needing to work.",
      description: "How much would you actually like?",
      component: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm">What dollar amount would you like to spend each month, after taxes, without working?</div>
          </div>
          <Input 
            type="number" 
            min={1000}
            max={100000}
            step={500}
            value={Math.round(inputs.retirementAnnualSpending / 12)}
            onChange={(e) => {
              const monthlyAmount = parseInt(e.target.value) || 0;
              updateInputs("retirement-income", monthlyAmount * 12);
            }}
          />
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        return { ...currentInputs, retirementAnnualSpending: value };
      }
    },
    {
      id: "social-security",
      title: "Annual Social Security & Pension Income",
      description: "(Please use a yearly estimate)",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="social-security">
              Estimated annual Social Security in retirement. 
              <span className="font-medium"> Based on your information consider entering $58,000 as an estimate for now:</span>
            </Label>
            <Input 
              id="social-security" 
              type="number"
              min={0}
              max={100000}
              step={1000}
              value={inputs.socialSecurityBenefit}
              onChange={(e) => {
                const amount = parseInt(e.target.value) || 0;
                updateInputs("social-security", { ss: amount, pension: inputs.pensionAmount });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pension">
              Estimated annual pension in retirement ("0" if none):
            </Label>
            <Input 
              id="pension" 
              type="number"
              min={0}
              max={500000}
              step={1000}
              value={inputs.pensionAmount}
              onChange={(e) => {
                const amount = parseInt(e.target.value) || 0;
                const hasPension = amount > 0;
                updateInputs("social-security", { ss: inputs.socialSecurityBenefit, pension: amount, hasPension });
              }}
            />
          </div>
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        return { 
          ...currentInputs, 
          socialSecurityBenefit: value.ss,
          pensionAmount: value.pension,
          hasPension: value.hasPension || value.pension > 0
        };
      }
    },
    {
      id: "plan-topics",
      title: `${inputs.name || "Andy"}, select what to include in your plan:`,
      component: (
        <RadioGroup 
          value="detailed"
          onValueChange={(value) => updateInputs("plan-topics", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="detailed" id="detailed" />
            <Label htmlFor="detailed" className="flex-1 cursor-pointer">🔍 Include details</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="summary" id="summary" />
            <Label htmlFor="summary" className="flex-1 cursor-pointer">Just a summary, please</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        return currentInputs;
      }
    },
    {
      id: "state",
      title: `${inputs.name || "Andy"}, the hard part is already done!`,
      description: "Now, just a few details to finalize your plan...",
      component: (
        <div className="space-y-4">
          <div className="text-center py-8">
            <img 
              src="https://s.freefinancialplan.com/static/img/graphs.svg" 
              alt="Financial Planning" 
              className="h-40 mx-auto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Which state do you live in?</Label>
            <Input 
              id="state" 
              value={inputs.stateOfResidence}
              onChange={(e) => updateInputs("state", e.target.value)}
            />
          </div>
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        return { ...currentInputs, stateOfResidence: value };
      }
    },
    {
      id: "final-topics",
      title: `${inputs.name || "Andy"}, what would you like to cover today?`,
      component: (
        <RadioGroup 
          value="check-in"
          onValueChange={(value) => updateInputs("final-topics", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="check-in" id="check-in" />
            <Label htmlFor="check-in" className="flex-1 cursor-pointer">Just a check in</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted">
            <RadioGroupItem value="specific" id="specific" />
            <Label htmlFor="specific" className="flex-1 cursor-pointer">I have specific questions, needs, or concerns</Label>
          </div>
        </RadioGroup>
      ),
      updateInputs: (value, currentInputs) => {
        return currentInputs;
      }
    },
    {
      id: "thank-you",
      title: "How easy was it to answer these questions?",
      component: (
        <div className="space-y-6 text-center">
          <div className="flex justify-center space-x-2 text-3xl text-blue-900">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
          
          <div>
            <Input 
              placeholder="What did we miss? Any specific questions?"
              className="text-center"
            />
          </div>
        </div>
      ),
      updateInputs: (value, currentInputs) => {
        return currentInputs;
      }
    }
  ];

  // Filter questions to exclude spouse-health if no spouse
  const filteredQuestions = questions.filter(q => {
    if (q.id === "spouse-health" && (!inputs.spouseName || inputs.spouseName === "")) {
      return false;
    }
    return true;
  });

  // Update progress whenever the step changes
  const updateProgress = (step: number) => {
    const percentage = Math.round((step / (filteredQuestions.length - 1)) * 100);
    setProgress(percentage);
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentStep < filteredQuestions.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateProgress(nextStep);
    } else {
      // Last step, complete questionnaire
      onComplete(inputs);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateProgress(prevStep);
    } else {
      // First step, cancel questionnaire
      onCancel();
    }
  };

  const currentQuestion = filteredQuestions[currentStep];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        {progress > 0 && (
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-green-500 h-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="text-xs text-right text-gray-500">{progress}%</div>
          </div>
        )}
        <CardTitle className="text-xl text-center">{currentQuestion.title}</CardTitle>
        {currentQuestion.description && (
          <CardDescription className="text-center mt-1">
            {currentQuestion.description}
            {currentQuestion.description.includes("Learn more") && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 ml-1 inline cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80 text-sm">
                      Income includes salaries, wages, tips, and self-employment income. Add together all household income before taxes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-2 pb-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion.component}
        </motion.div>
      </CardContent>
      
      <div className="flex justify-center space-x-4 pb-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          className="w-20 h-12"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button 
          onClick={handleNext}
          className="w-20 h-12"
        >
          {currentStep === filteredQuestions.length - 1 ? (
            "Finish"
          ) : (
            <ArrowRightIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
};

export default Questionnaire;
