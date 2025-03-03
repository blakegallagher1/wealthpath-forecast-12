
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PhoneVerification from "./PhoneVerification";

interface VerificationScreenProps {
  onVerify: () => void;
  onCancel: () => void;
}

const VerificationScreen = ({ onVerify, onCancel }: VerificationScreenProps) => {
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
        <h2 className="text-xl font-semibold text-center">One More Step</h2>
        <p className="text-center text-neutral-600 mt-2">
          Please verify your phone number to calculate your retirement plan.
        </p>
      </div>
      <PhoneVerification onVerify={onVerify} />
      <div className="mt-6 text-center">
        <Button variant="link" onClick={onCancel}>
          Return to calculator
        </Button>
      </div>
    </motion.div>
  );
};

export default VerificationScreen;
