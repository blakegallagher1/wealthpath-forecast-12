
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StatusAlertProps {
  sustainabilityScore: number;
}

const StatusAlert = ({ sustainabilityScore }: StatusAlertProps) => {
  const getStatusDetails = () => {
    if (sustainabilityScore >= 80) {
      return {
        icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
        title: "On Track for a Secure Retirement",
        description: "Your retirement plan is well-funded and sustainable based on your current inputs.",
        variant: "default" as const,
      };
    } else if (sustainabilityScore >= 60) {
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

  return (
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
  );
};

export default StatusAlert;
