
import { motion } from "framer-motion";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, AlertTriangle, DollarSign, TrendingUp, Percent, Calendar, Clock, PiggyBank } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RetirementSummaryProps {
  plan: RetirementPlan;
  inputs: CalculatorInputs;
}

const RetirementSummary = ({ plan, inputs }: RetirementSummaryProps) => {
  const getStatusDetails = () => {
    if (plan.sustainabilityScore >= 80) {
      return {
        icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
        title: "On Track for a Secure Retirement",
        description: "Your retirement plan is well-funded and sustainable based on your current inputs.",
        variant: "default" as const,
      };
    } else if (plan.sustainabilityScore >= 60) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
        title: "Potential Adjustments Needed",
        description: "Your retirement plan may need some adjustments to ensure long-term sustainability.",
        variant: "default" as const,
      };
    } else {
      return {
        icon: <AlertCircle className="h-6 w-6 text-red-500" />,
        title: "Significant Changes Recommended",
        description: "Your current plan may not support your retirement goals. Consider the recommendations below.",
        variant: "destructive" as const,
      };
    }
  };

  const status = getStatusDetails();
  
  // Format numbers in a more controlled way
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Alert variant={status.variant} className="border-l-4 border-l-blue-500">
        <div className="flex items-start">
          {status.icon}
          <div className="ml-3">
            <AlertTitle className="text-xl font-medium">{status.title}</AlertTitle>
            <AlertDescription className="text-neutral-700 mt-1">
              {status.description}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="text-sm text-neutral-500 uppercase tracking-wider">Estimated at Retirement</div>
          <div className="text-3xl font-medium mt-2">{formatCurrency(plan.totalRetirementSavings)}</div>
          <div className="text-sm text-neutral-600 mt-1">in {yearsToRetirement} years at age {inputs.retirementAge}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="text-sm text-neutral-500 uppercase tracking-wider">Retirement Income</div>
          <div className="text-3xl font-medium mt-2">{formatCurrency(plan.estimatedAnnualRetirementIncome)}</div>
          <div className="text-sm text-neutral-600 mt-1">estimated annual retirement income</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="text-sm text-neutral-500 uppercase tracking-wider">Plan Sustainability</div>
          <div className="text-3xl font-medium mt-2">{plan.portfolioLongevity}</div>
          <div className="text-sm text-neutral-600 mt-1">age when funds may be depleted</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm"
      >
        <h3 className="text-lg font-medium mb-4">Retirement Plan Details</h3>
        
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
                <span className="font-medium">{formatCurrency(monthlyRetirementIncome)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Income Replacement:</span>
                <span className="font-medium">{replacementRatio.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Social Security:</span>
                <span className="font-medium">{formatCurrency(inputs.socialSecurityBenefit * 12)}/yr</span>
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
                <span className="font-medium">{formatCurrency(inputs.retirementAccounts + inputs.rothAccounts + inputs.taxableInvestments)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Annual Contributions:</span>
                <span className="font-medium">{formatCurrency(inputs.annual401kContribution + inputs.annualRothContribution + inputs.annualTaxableContribution)}</span>
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
      </motion.div>
    </motion.div>
  );
};

export default RetirementSummary;
