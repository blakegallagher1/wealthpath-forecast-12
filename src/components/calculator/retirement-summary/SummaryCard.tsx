
import { motion } from "framer-motion";

interface SummaryCardProps {
  label: string;
  value: string;
  description: string;
  delay?: number;
}

const SummaryCard = ({ label, value, description, delay = 0.1 }: SummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm"
    >
      <div className="text-sm text-neutral-500 uppercase tracking-wider">{label}</div>
      <div className="text-3xl font-medium mt-2">{value}</div>
      <div className="text-sm text-neutral-600 mt-1">{description}</div>
    </motion.div>
  );
};

export default SummaryCard;
