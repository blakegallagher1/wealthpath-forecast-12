
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PhoneVerification from "./PhoneVerification";

interface VerificationScreenProps {
  onVerify: () => void;
  onCancel: () => void;
}

const VerificationScreen = ({ onVerify, onCancel }: VerificationScreenProps) => {
  // For demo purposes, we'll automatically verify without actual verification
  const handleDemoVerify = () => {
    onVerify();
  };

  return (
    <motion.div
      key="verification"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="py-4"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-center">Demo Mode</h2>
        <p className="text-center text-neutral-600 mt-2">
          In the demo version, phone verification is not required.
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <Button onClick={handleDemoVerify} className="mx-2">
          Continue to Results
        </Button>
        <Button variant="outline" onClick={onCancel} className="mx-2">
          Return to Calculator
        </Button>
      </div>
    </motion.div>
  );
};

export default VerificationScreen;
