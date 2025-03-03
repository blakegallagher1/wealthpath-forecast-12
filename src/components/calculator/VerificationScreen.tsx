
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
        <h2 className="text-xl font-semibold text-center dark:text-white">Personal Retirement Calculator</h2>
        <p className="text-center text-neutral-600 dark:text-neutral-300 mt-2">
          Click continue to see your personalized retirement analysis.
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <Button onClick={onVerify} className="mx-2">
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
