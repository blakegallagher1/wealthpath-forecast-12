
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";
import { formatChartCurrency } from "./utils/chartFormatters";

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
          tickFormatter={(value) => formatChartCurrency(value)}
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => [formatChartCurrency(value), ""]}
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
            const label = value === "conservative" 
              ? "Conservative (3%)" 
              : value === "moderate" 
                ? "Moderate (4%)" 
                : "Aggressive (5%)";
            return <span style={{ color: isDark ? "#fff" : "#000" }}>{label}</span>;
          }}
        />
        
        {/* Reference line for retirement age */}
        {retirementAge && (
          <Line
            type="monotone"
            dataKey="conservative"
            stroke={colors.conservative}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="conservative"
          />
        )}
        
        {/* Strategy lines */}
        <Line
          type="monotone"
          dataKey="moderate"
          stroke={colors.moderate}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="moderate"
        />
        
        <Line
          type="monotone"
          dataKey="aggressive"
          stroke={colors.aggressive}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="aggressive"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WithdrawalStrategyChart;
