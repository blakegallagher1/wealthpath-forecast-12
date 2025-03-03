
import { ReferenceLine } from "recharts";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";

interface ReferenceLinesProps {
  data: WithdrawalStrategyDataPoint[];
  colors: {
    conservative: string;
    moderate: string;
    aggressive: string;
    referenceLines: string;
  };
}

const ReferenceLines = ({ data, colors }: ReferenceLinesProps) => {
  // Find retirement age for reference line
  const retirementAgePoint = data.find(point => point.isRetirementAge);
  const retirementAge = retirementAgePoint?.age;

  // Find depletion points (when balance hits zero or very low)
  const findDepletionAge = (key: 'aggressive' | 'moderate' | 'conservative') => {
    // Consider "depleted" when balance falls below 1% of maximum value
    const maxValue = Math.max(...data.map(d => d[key]));
    const threshold = maxValue * 0.01;
    
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i][key] > threshold) {
        return data[i].age;
      }
    }
    return null;
  };

  const aggressiveDepletionAge = findDepletionAge('aggressive');
  const moderateDepletionAge = findDepletionAge('moderate');
  const conservativeDepletionAge = findDepletionAge('conservative');

  return (
    <>
      {/* Retirement age reference line */}
      {retirementAge && (
        <ReferenceLine 
          x={retirementAge} 
          stroke="#0891b2" 
          strokeWidth={1.5}
          strokeDasharray="5 5"
          label={{ 
            value: 'Retirement', 
            position: 'insideTopRight', 
            fontSize: 11, 
            fill: '#0891b2' 
          }}
        />
      )}
      
      {/* Depletion reference lines */}
      {aggressiveDepletionAge && (
        <ReferenceLine 
          x={aggressiveDepletionAge} 
          stroke={colors.aggressive} 
          strokeWidth={1}
          strokeDasharray="3 3"
          label={{ 
            value: '5% Depletion', 
            position: 'insideBottom', 
            fontSize: 10, 
            fill: colors.aggressive
          }}
        />
      )}
      
      {moderateDepletionAge && moderateDepletionAge < 90 && (
        <ReferenceLine 
          x={moderateDepletionAge} 
          stroke={colors.moderate} 
          strokeWidth={1}
          strokeDasharray="3 3"
          label={{ 
            value: '4% Depletion', 
            position: 'insideBottom', 
            fontSize: 10, 
            fill: colors.moderate 
          }}
        />
      )}
      
      {conservativeDepletionAge && conservativeDepletionAge < 90 && (
        <ReferenceLine 
          x={conservativeDepletionAge} 
          stroke={colors.conservative} 
          strokeWidth={1}
          strokeDasharray="3 3"
          label={{ 
            value: '3% Depletion', 
            position: 'insideBottom', 
            fontSize: 10, 
            fill: colors.conservative
          }}
        />
      )}
    </>
  );
};

export default ReferenceLines;
