
import { useState } from "react";
import { motion } from "framer-motion";
import { CalculatorInputs, RetirementPlan } from "@/lib/calculator/types";
import RetirementSummary from "./RetirementSummary";
import ResultsTabs from "./results/ResultsTabs";
import ActionButtons from "./results/ActionButtons";
import CalculatorAssumptions from "./results/CalculatorAssumptions";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResultsProps {
  plan: RetirementPlan;
  inputs: CalculatorInputs;
  onRecalculate: () => void;
}

const Results = ({ plan, inputs, onRecalculate }: ResultsProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Handle email dialog
  const handleSendEmail = () => {
    setIsEmailDialogOpen(true);
  };

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle email submission
  const submitEmail = async () => {
    if (!isValidEmail(emailAddress)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call to email service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would send the data to a backend API
      // const response = await fetch('/api/send-retirement-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: emailAddress, planData: plan, inputs })
      // });
      
      // Get spouse data for summary
      const hasSpousalSS = plan.incomeSourcesData.some(d => d.spouseSocialSecurity > 0);
      const ssStartingPoint = plan.incomeSourcesData.find(d => d.socialSecurity > 0);
      const spouseBenefitSummary = hasSpousalSS ? 
        `Your spouse is eligible for ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(ssStartingPoint?.spouseSocialSecurity || 0)} annually in Social Security benefits.` : '';
      
      setIsEmailDialogOpen(false);
      setEmailAddress("");
      
      toast({
        title: "Email Sent",
        description: `Your retirement plan has been sent to ${emailAddress}. Please check your inbox.`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8" id="retirement-results-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RetirementSummary plan={plan} inputs={inputs} />
      </motion.div>

      <ResultsTabs 
        plan={plan} 
        inputs={inputs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {activeTab === "summary" && <CalculatorAssumptions />}

      <ActionButtons 
        onRecalculate={onRecalculate} 
        onSendEmail={handleSendEmail} 
      />

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Your Retirement Plan</DialogTitle>
            <DialogDescription>
              Enter your email address to receive a copy of your retirement plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitEmail}
              disabled={!emailAddress || isSending}
            >
              {isSending ? "Sending..." : "Send Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;
