
import { motion } from "framer-motion";
import { CalculatorInputs } from "@/lib/calculator/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface IncomeExpensesSectionProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const IncomeExpensesSection = ({ inputs, onChange }: IncomeExpensesSectionProps) => {
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
        <Label htmlFor="annualIncome">Annual Income ($)</Label>
        <Input
          id="annualIncome"
          type="number"
          min={0}
          value={inputs.annualIncome.toString()}
          onChange={(e) => handleNumberChange("annualIncome", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="incomeGrowthRate">Income Growth Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="incomeGrowthRate"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.incomeGrowthRate]}
            onValueChange={(value) => onChange({ incomeGrowthRate: value[0] })}
            className="flex-1 mr-4"
          />
          <span className="w-12 text-right">{inputs.incomeGrowthRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="spouseIncome">Spouse Annual Income ($)</Label>
        <Input
          id="spouseIncome"
          type="number"
          min={0}
          value={inputs.spouseIncome.toString()}
          onChange={(e) => handleNumberChange("spouseIncome", e.target.value)}
          className="mt-1.5"
          disabled={!inputs.spouseName}
        />
      </div>

      <div>
        <Label htmlFor="spouseIncomeGrowthRate">Spouse Income Growth Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="spouseIncomeGrowthRate"
            min={0}
            max={10}
            step={0.1}
            value={[inputs.spouseIncomeGrowthRate]}
            onValueChange={(value) => onChange({ spouseIncomeGrowthRate: value[0] })}
            className="flex-1 mr-4"
            disabled={!inputs.spouseName}
          />
          <span className="w-12 text-right">{inputs.spouseIncomeGrowthRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="expensePercentOfIncome">Expense Percentage of Income (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="expensePercentOfIncome"
            min={10}
            max={100}
            step={1}
            value={[inputs.expensePercentOfIncome]}
            onValueChange={(value) => onChange({ expensePercentOfIncome: value[0] })}
            className="flex-1 mr-4"
          />
          <span className="w-12 text-right">{inputs.expensePercentOfIncome}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="annualBonusAmount">Annual Bonus/Commission ($)</Label>
        <Input
          id="annualBonusAmount"
          type="number"
          min={0}
          value={inputs.annualBonusAmount.toString()}
          onChange={(e) => handleNumberChange("annualBonusAmount", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="retirementAnnualSpending">Desired Annual Retirement Spending ($)</Label>
        <Input
          id="retirementAnnualSpending"
          type="number"
          min={0}
          value={inputs.retirementAnnualSpending.toString()}
          onChange={(e) => handleNumberChange("retirementAnnualSpending", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="hasPension">Pension Income</Label>
          <Switch
            id="hasPension"
            checked={inputs.hasPension}
            onCheckedChange={(checked) => onChange({ hasPension: checked })}
          />
        </div>
        {inputs.hasPension && (
          <Input
            type="number"
            min={0}
            value={inputs.pensionAmount.toString()}
            onChange={(e) => handleNumberChange("pensionAmount", e.target.value)}
            className="mt-1.5"
            placeholder="Annual pension amount ($)"
          />
        )}
      </div>
    </motion.div>
  );
};

export default IncomeExpensesSection;
