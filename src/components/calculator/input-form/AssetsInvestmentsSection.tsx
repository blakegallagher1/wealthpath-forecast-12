
import { motion } from "framer-motion";
import { CalculatorInputs } from "@/lib/calculator/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssetsInvestmentsSectionProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const AssetsInvestmentsSection = ({ inputs, onChange }: AssetsInvestmentsSectionProps) => {
  const handleNumberChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    onChange({ [field]: numValue });
  };

  const handleTextChange = (field: keyof CalculatorInputs, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4"
    >
      <div>
        <Label htmlFor="cashSavings">Cash Savings ($)</Label>
        <Input
          id="cashSavings"
          type="number"
          min={0}
          value={inputs.cashSavings.toString()}
          onChange={(e) => handleNumberChange("cashSavings", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="retirementAccounts">Retirement Accounts - 401k, IRA ($)</Label>
        <Input
          id="retirementAccounts"
          type="number"
          min={0}
          value={inputs.retirementAccounts.toString()}
          onChange={(e) => handleNumberChange("retirementAccounts", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="rothAccounts">Roth Accounts ($)</Label>
        <Input
          id="rothAccounts"
          type="number"
          min={0}
          value={inputs.rothAccounts.toString()}
          onChange={(e) => handleNumberChange("rothAccounts", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="taxableInvestments">Taxable Investments ($)</Label>
        <Input
          id="taxableInvestments"
          type="number"
          min={0}
          value={inputs.taxableInvestments.toString()}
          onChange={(e) => handleNumberChange("taxableInvestments", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="realEstateEquity">Real Estate Equity ($)</Label>
        <Input
          id="realEstateEquity"
          type="number"
          min={0}
          value={inputs.realEstateEquity.toString()}
          onChange={(e) => handleNumberChange("realEstateEquity", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="annual401kContribution">Annual 401k Contribution ($)</Label>
        <Input
          id="annual401kContribution"
          type="number"
          min={0}
          max={22500}
          value={inputs.annual401kContribution.toString()}
          onChange={(e) => handleNumberChange("annual401kContribution", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="annualRothContribution">Annual Roth Contribution ($)</Label>
        <Input
          id="annualRothContribution"
          type="number"
          min={0}
          max={6500}
          value={inputs.annualRothContribution.toString()}
          onChange={(e) => handleNumberChange("annualRothContribution", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="annualTaxableContribution">Annual Taxable Investment Contribution ($)</Label>
        <Input
          id="annualTaxableContribution"
          type="number"
          min={0}
          value={inputs.annualTaxableContribution.toString()}
          onChange={(e) => handleNumberChange("annualTaxableContribution", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="investmentReturnRate">Investment Return Rate (%)</Label>
        <div className="flex items-center mt-1.5">
          <Slider
            id="investmentReturnRate"
            min={0}
            max={12}
            step={0.1}
            value={[inputs.investmentReturnRate]}
            onValueChange={(value) => onChange({ investmentReturnRate: value[0] })}
            className="flex-1 mr-4"
          />
          <span className="w-12 text-right">{inputs.investmentReturnRate.toFixed(1)}%</span>
        </div>
      </div>

      <div>
        <Label htmlFor="riskProfile">Risk Profile</Label>
        <Select 
          value={inputs.riskProfile} 
          onValueChange={(value) => handleTextChange("riskProfile", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select risk profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conservative">Conservative</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="aggressive">Aggressive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default AssetsInvestmentsSection;
