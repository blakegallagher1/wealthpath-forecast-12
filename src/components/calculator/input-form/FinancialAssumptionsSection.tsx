
import { motion } from "framer-motion";
import { CalculatorInputs } from "@/lib/calculator/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FinancialAssumptionsSectionProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const FinancialAssumptionsSection = ({ inputs, onChange }: FinancialAssumptionsSectionProps) => {
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
        <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="inflationRate"
            min={0}
            max={8}
            step={0.1}
            value={[inputs.inflationRate]}
            onValueChange={(value) => onChange({ inflationRate: value[0] })}
            className="flex-1 mr-4"
          />
          <span className="w-12 text-right">{inputs.inflationRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="retirementWithdrawalRate">Retirement Withdrawal Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="retirementWithdrawalRate"
            min={2}
            max={8}
            step={0.1}
            value={[inputs.retirementWithdrawalRate]}
            onValueChange={(value) => onChange({ retirementWithdrawalRate: value[0] })}
            className="flex-1 mr-4"
          />
          <span className="w-12 text-right">{inputs.retirementWithdrawalRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="lifeExpectancy">Life Expectancy (Age)</Label>
        <Input
          id="lifeExpectancy"
          type="number"
          min={Math.max(inputs.currentAge, inputs.retirementAge)}
          max={120}
          value={inputs.lifeExpectancy.toString()}
          onChange={(e) => handleNumberChange("lifeExpectancy", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="socialSecurityBenefit">Monthly Social Security Benefit ($)</Label>
        <Input
          id="socialSecurityBenefit"
          type="number"
          min={0}
          value={inputs.socialSecurityBenefit?.toString() || "0"}
          onChange={(e) => handleNumberChange("socialSecurityBenefit", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="spouseSocialSecurityBenefit">Spouse Monthly Social Security Benefit ($)</Label>
        <Input
          id="spouseSocialSecurityBenefit"
          type="number"
          min={0}
          value={inputs.spouseSocialSecurityBenefit?.toString() || "0"}
          onChange={(e) => handleNumberChange("spouseSocialSecurityBenefit", e.target.value)}
          className="mt-1.5"
          disabled={!inputs.spouseName}
        />
      </div>
    </motion.div>
  );
};

export default FinancialAssumptionsSection;
