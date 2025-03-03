import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CalculatorInputs } from "@/lib/calculator/types";
import { motion } from "framer-motion";

interface InputFormProps {
  inputs: CalculatorInputs;
  onChange: (inputs: Partial<CalculatorInputs>) => void;
}

const InputForm = ({ inputs, onChange }: InputFormProps) => {
  const [openSections, setOpenSections] = useState<string[]>(["personal"]);

  const handleNumberChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    onChange({ [field]: numValue });
  };

  const handleTextChange = (field: keyof CalculatorInputs, value: string) => {
    onChange({ [field]: value });
  };

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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="income" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Income & Expenses</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="assets" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Assets & Investments</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="liabilities" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Liabilities</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lifeEvents" className="border-b border-neutral-200">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Life Events</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="assumptions" className="border-b-0">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center">
              <span className="text-lg font-medium">Financial Assumptions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InputForm;
