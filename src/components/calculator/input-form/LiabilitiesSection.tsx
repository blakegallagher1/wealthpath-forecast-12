
import { motion } from "framer-motion";
import { CalculatorInputs } from "@/lib/calculator/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface LiabilitiesSectionProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const LiabilitiesSection = ({ inputs, onChange }: LiabilitiesSectionProps) => {
  const handleNumberChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    onChange({ [field]: numValue });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4"
    >
      <div>
        <Label htmlFor="mortgageBalance">Mortgage Balance ($)</Label>
        <Input
          id="mortgageBalance"
          type="number"
          min={0}
          value={inputs.mortgageBalance.toString()}
          onChange={(e) => handleNumberChange("mortgageBalance", e.target.value)}
          className="mt-1.5"
        />
      </div>
      
      <div>
        <Label htmlFor="mortgageInterestRate">Mortgage Interest Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="mortgageInterestRate"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.mortgageInterestRate]}
            onValueChange={(value) => onChange({ mortgageInterestRate: value[0] })}
            className="flex-1 mr-4"
            disabled={inputs.mortgageBalance <= 0}
          />
          <span className="w-12 text-right">{inputs.mortgageInterestRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="studentLoanBalance">Student Loan Balance ($)</Label>
        <Input
          id="studentLoanBalance"
          type="number"
          min={0}
          value={inputs.studentLoanBalance.toString()}
          onChange={(e) => handleNumberChange("studentLoanBalance", e.target.value)}
          className="mt-1.5"
        />
      </div>
      
      <div>
        <Label htmlFor="studentLoanInterestRate">Student Loan Interest Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="studentLoanInterestRate"
            min={0}
            max={12}
            step={0.1}
            value={[inputs.studentLoanInterestRate]}
            onValueChange={(value) => onChange({ studentLoanInterestRate: value[0] })}
            className="flex-1 mr-4"
            disabled={inputs.studentLoanBalance <= 0}
          />
          <span className="w-12 text-right">{inputs.studentLoanInterestRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="autoLoanBalance">Auto Loan Balance ($)</Label>
        <Input
          id="autoLoanBalance"
          type="number"
          min={0}
          value={inputs.autoLoanBalance.toString()}
          onChange={(e) => handleNumberChange("autoLoanBalance", e.target.value)}
          className="mt-1.5"
        />
      </div>
      
      <div>
        <Label htmlFor="autoLoanInterestRate">Auto Loan Interest Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="autoLoanInterestRate"
            min={0}
            max={15}
            step={0.1}
            value={[inputs.autoLoanInterestRate]}
            onValueChange={(value) => onChange({ autoLoanInterestRate: value[0] })}
            className="flex-1 mr-4"
            disabled={inputs.autoLoanBalance <= 0}
          />
          <span className="w-12 text-right">{inputs.autoLoanInterestRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="creditCardBalance">Credit Card Balance ($)</Label>
        <Input
          id="creditCardBalance"
          type="number"
          min={0}
          value={inputs.creditCardBalance.toString()}
          onChange={(e) => handleNumberChange("creditCardBalance", e.target.value)}
          className="mt-1.5"
        />
      </div>
      
      <div>
        <Label htmlFor="creditCardInterestRate">Credit Card Interest Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="creditCardInterestRate"
            min={0}
            max={30}
            step={0.1}
            value={[inputs.creditCardInterestRate]}
            onValueChange={(value) => onChange({ creditCardInterestRate: value[0] })}
            className="flex-1 mr-4"
            disabled={inputs.creditCardBalance <= 0}
          />
          <span className="w-12 text-right">{inputs.creditCardInterestRate.toFixed(1)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LiabilitiesSection;
