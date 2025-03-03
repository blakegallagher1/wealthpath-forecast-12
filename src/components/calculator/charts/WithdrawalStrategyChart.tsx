
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";

interface WithdrawalStrategyChartProps {
  data: WithdrawalStrategyDataPoint[];
}

const WithdrawalStrategyChart = ({ data }: WithdrawalStrategyChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = useMemo(() => ({
    conservative: "#10b981", // Green
    moderate: "#f59e0b",     // Amber
    aggressive: "#ef4444",   // Red
    grid: isDark ? "#333" : "#e5e5e5",
    text: isDark ? "#ccc" : "#666",
    referenceLines: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
  }), [isDark]);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis 
          dataKey="age" 
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={formatCurrency}
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), ""]}
          labelFormatter={(age) => `Age: ${age}`}
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            borderColor: colors.grid,
            borderRadius: "0.375rem",
            color: colors.text,
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: "12px" }} 
          formatter={(value, entry) => {
            const label = value === "3% Withdrawal Rate" 
              ? "Conservative (3%)" 
              : value === "4% Withdrawal Rate" 
                ? "Moderate (4%)" 
                : "Aggressive (5%)";
            return <span style={{ color: isDark ? "#fff" : "#000" }}>{label}</span>;
          }}
        />
        
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
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WithdrawalStrategyChart;
