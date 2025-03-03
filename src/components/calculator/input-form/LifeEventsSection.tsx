
import { motion } from "framer-motion";
import { CalculatorInputs } from "@/lib/calculator/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LifeEventsSectionProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const LifeEventsSection = ({ inputs, onChange }: LifeEventsSectionProps) => {
  const handleNumberChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    onChange({ [field]: numValue });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-4"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="planningWedding">Wedding Planning</Label>
          <Switch
            id="planningWedding"
            checked={inputs.planningWedding}
            onCheckedChange={(checked) => onChange({ planningWedding: checked })}
          />
        </div>
        {inputs.planningWedding && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="weddingYear">Wedding Year</Label>
              <Input
                id="weddingYear"
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 20}
                value={inputs.weddingYear.toString()}
                onChange={(e) => handleNumberChange("weddingYear", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="weddingCost">Estimated Cost ($)</Label>
              <Input
                id="weddingCost"
                type="number"
                min={0}
                value={inputs.weddingCost.toString()}
                onChange={(e) => handleNumberChange("weddingCost", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="planningChildren">Planning for Children</Label>
          <Switch
            id="planningChildren"
            checked={inputs.planningChildren}
            onCheckedChange={(checked) => onChange({ planningChildren: checked })}
          />
        </div>
        {inputs.planningChildren && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="numberOfChildren">Number of Children</Label>
              <Select 
                value={inputs.numberOfChildren.toString()} 
                onValueChange={(value) => handleNumberChange("numberOfChildren", value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="childCostPerYear">Cost Per Child Per Year ($)</Label>
              <Input
                id="childCostPerYear"
                type="number"
                min={0}
                value={inputs.childCostPerYear.toString()}
                onChange={(e) => handleNumberChange("childCostPerYear", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="planningHomePurchase">Home Purchase</Label>
          <Switch
            id="planningHomePurchase"
            checked={inputs.planningHomePurchase}
            onCheckedChange={(checked) => onChange({ planningHomePurchase: checked })}
          />
        </div>
        {inputs.planningHomePurchase && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="homePurchaseYear">Purchase Year</Label>
              <Input
                id="homePurchaseYear"
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 20}
                value={inputs.homePurchaseYear.toString()}
                onChange={(e) => handleNumberChange("homePurchaseYear", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="homeDownPayment">Down Payment ($)</Label>
              <Input
                id="homeDownPayment"
                type="number"
                min={0}
                value={inputs.homeDownPayment.toString()}
                onChange={(e) => handleNumberChange("homeDownPayment", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LifeEventsSection;
