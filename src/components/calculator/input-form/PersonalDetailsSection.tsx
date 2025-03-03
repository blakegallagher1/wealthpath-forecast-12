
import { useState } from "react";
import { motion } from "framer-motion";
import { CalculatorInputs } from "@/lib/calculator/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalDetailsSectionProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const PersonalDetailsSection = ({ inputs, onChange }: PersonalDetailsSectionProps) => {
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
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          value={inputs.name}
          onChange={(e) => handleTextChange("name", e.target.value)}
          placeholder="Enter your name"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="spouseName">Spouse Name (if applicable)</Label>
        <Input
          id="spouseName"
          value={inputs.spouseName}
          onChange={(e) => handleTextChange("spouseName", e.target.value)}
          placeholder="Enter spouse name"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="currentAge">Your Current Age</Label>
        <Input
          id="currentAge"
          type="number"
          min={18}
          max={100}
          value={inputs.currentAge.toString()}
          onChange={(e) => handleNumberChange("currentAge", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="spouseAge">Spouse Current Age</Label>
        <Input
          id="spouseAge"
          type="number"
          min={18}
          max={100}
          value={inputs.spouseAge.toString()}
          onChange={(e) => handleNumberChange("spouseAge", e.target.value)}
          className="mt-1.5"
          disabled={!inputs.spouseName}
        />
      </div>

      <div>
        <Label htmlFor="retirementAge">Your Retirement Age</Label>
        <Input
          id="retirementAge"
          type="number"
          min={inputs.currentAge + 1}
          max={100}
          value={inputs.retirementAge.toString()}
          onChange={(e) => handleNumberChange("retirementAge", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="spouseRetirementAge">Spouse Retirement Age</Label>
        <Input
          id="spouseRetirementAge"
          type="number"
          min={inputs.spouseAge + 1}
          max={100}
          value={inputs.spouseRetirementAge.toString()}
          onChange={(e) => handleNumberChange("spouseRetirementAge", e.target.value)}
          className="mt-1.5"
          disabled={!inputs.spouseName}
        />
      </div>

      <div>
        <Label htmlFor="ssStartAge">Social Security Start Age</Label>
        <Select 
          value={inputs.ssStartAge.toString()} 
          onValueChange={(value) => handleNumberChange("ssStartAge", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select age" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="62">62 (Reduced Benefits)</SelectItem>
            <SelectItem value="67">67 (Full Retirement Age)</SelectItem>
            <SelectItem value="70">70 (Maximum Benefits)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="stateOfResidence">State of Residence</Label>
        <Select 
          value={inputs.stateOfResidence} 
          onValueChange={(value) => handleTextChange("stateOfResidence", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="NY">New York</SelectItem>
            <SelectItem value="TX">Texas</SelectItem>
            <SelectItem value="FL">Florida</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default PersonalDetailsSection;
