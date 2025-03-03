
import { Line } from "recharts";

interface StrategyLinesProps {
  colors: {
    conservative: string;
    moderate: string;
    aggressive: string;
  };
}

const StrategyLines = ({ colors }: StrategyLinesProps) => {
  return (
    <>
      {/* Conservative strategy (3%) */}
      <Line
        type="monotone"
        dataKey="conservative"
        stroke={colors.conservative}
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 6 }}
        name="3% Withdrawal Rate"
      />
      
      {/* Moderate strategy (4%) */}
      <Line
        type="monotone"
        dataKey="moderate"
        stroke={colors.moderate}
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 6 }}
        name="4% Withdrawal Rate"
      />
      
      {/* Aggressive strategy (5%) */}
      <Line
        type="monotone"
        dataKey="aggressive"
        stroke={colors.aggressive}
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 6 }}
        name="5% Withdrawal Rate"
      />
    </>
  );
};

export default StrategyLines;
