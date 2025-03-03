
import { Clock, DollarSign, Percent, PiggyBank } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { formatSummaryValue } from "../utils/formatters";

interface DetailSectionProps {
  plan: RetirementPlan;
  inputs: CalculatorInputs;
}

const DetailSection = ({ plan, inputs }: DetailSectionProps) => {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const retirementDuration = plan.portfolioLongevity - inputs.retirementAge;
  const savingsRatio = (inputs.annual401kContribution + inputs.annualRothContribution + inputs.annualTaxableContribution) / 
                     (inputs.annualIncome + inputs.spouseIncome) * 100;
  
  // Calculate monthly retirement income
  const monthlyRetirementIncome = plan.estimatedAnnualRetirementIncome / 12;
  
  // Calculate replacement ratio (retirement income vs. current income)
  const currentTotalIncome = inputs.annualIncome + inputs.spouseIncome;
  const replacementRatio = currentTotalIncome > 0 
    ? (plan.estimatedAnnualRetirementIncome / currentTotalIncome) * 100 
    : 0;

  // Get Social Security data from the plan
  const ssAtFRA = plan.socialSecurityData.find(d => d.claimingAge === 67)?.monthlyBenefit || 0;
  const annualSocialSecurity = ssAtFRA * 12;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
      <div>
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          <span>Retirement Timeline</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Years Until Retirement:</span>
            <span className="font-medium">{yearsToRetirement} years</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Retirement Duration:</span>
            <span className="font-medium">{retirementDuration} years</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>End of Plan:</span>
            <span className="font-medium">Age {plan.portfolioLongevity}</span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Income Metrics</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Monthly Retirement:</span>
            <span className="font-medium">{formatSummaryValue(monthlyRetirementIncome)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Income Replacement:</span>
            <span className="font-medium">{replacementRatio.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Social Security:</span>
            <span className="font-medium">{formatSummaryValue(annualSocialSecurity)}/yr</span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <PiggyBank className="w-4 h-4 mr-2" />
          <span>Savings Analysis</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Current Savings:</span>
            <span className="font-medium">{formatSummaryValue(inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Annual Contributions:</span>
            <span className="font-medium">{formatSummaryValue(inputs.annual401kContribution + inputs.annualRothContribution + inputs.annualTaxableContribution)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Savings Ratio:</span>
            <span className="font-medium">{savingsRatio.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <Percent className="w-4 h-4 mr-2" />
          <span>Plan Health</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Success Probability:</span>
            <span className="font-medium">{plan.successProbability}%</span>
          </div>
          <div className="flex items-center mt-1">
            <Progress value={plan.successProbability} className="h-2" />
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span>Sustainability Score:</span>
            <span className="font-medium">{plan.sustainabilityScore}/100</span>
          </div>
          <div className="flex items-center mt-1">
            <Progress value={plan.sustainabilityScore} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSection;
