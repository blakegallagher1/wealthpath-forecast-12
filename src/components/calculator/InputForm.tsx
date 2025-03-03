
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CalculatorInputs } from "@/lib/calculator/types";
import {
  PersonalDetailsSection,
  IncomeExpensesSection,
  AssetsInvestmentsSection,
  LiabilitiesSection,
  LifeEventsSection,
  FinancialAssumptionsSection
} from "./input-form";

interface InputFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const InputForm = ({ inputs, onChange }: InputFormProps) => {
  const [openSections, setOpenSections] = useState<string[]>(["personal"]);

  const handleAccordionChange = (value: string) => {
    setOpenSections((prev) => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-neutral-600 mb-6">
        Enter your personal details, income, assets, and financial assumptions to create a comprehensive retirement plan.
      </p>
      
      <Accordion 
        type="multiple" 
        value={openSections} 
        onValueChange={setOpenSections}
        className="w-full"
      >
        <AccordionItem value="personal" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Personal Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PersonalDetailsSection inputs={inputs} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="income" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Income & Expenses</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <IncomeExpensesSection inputs={inputs} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="assets" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Assets & Investments</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AssetsInvestmentsSection inputs={inputs} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="liabilities" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Liabilities</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LiabilitiesSection inputs={inputs} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lifeEvents" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Life Events</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LifeEventsSection inputs={inputs} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="assumptions" className="border-b-0">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Financial Assumptions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <FinancialAssumptionsSection inputs={inputs} onChange={onChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InputForm;
