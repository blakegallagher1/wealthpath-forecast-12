
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <motion.h1 
            className="text-2xl font-medium text-neutral-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="block text-sm text-neutral-500 font-normal">WealthPath</span>
            Retirement Calculator
          </motion.h1>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
