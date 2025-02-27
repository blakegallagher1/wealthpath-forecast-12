
import { motion } from "framer-motion";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

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
  
  const formattedRetirementSavings = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(plan.totalRetirementSavings);

  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;

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
          <div className="text-3xl font-medium mt-2">{formattedRetirementSavings}</div>
          <div className="text-sm text-neutral-600 mt-1">in {yearsToRetirement} years at age {inputs.retirementAge}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="text-sm text-neutral-500 uppercase tracking-wider">Retirement Income</div>
          <div className="text-3xl font-medium mt-2">${new Intl.NumberFormat("en-US").format(plan.estimatedAnnualRetirementIncome)}</div>
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
    </motion.div>
  );
};

export default RetirementSummary;
