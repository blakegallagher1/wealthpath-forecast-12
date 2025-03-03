
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";
import { formatChartCurrency } from "./utils/chartFormatters";
import { findDepletionAge } from "./utils/chartFormatters";

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
  const aggressiveDepletionAge = findDepletionAge(data, 'aggressive');
  const moderateDepletionAge = findDepletionAge(data, 'moderate');
  const conservativeDepletionAge = findDepletionAge(data, 'conservative');

  // Find balance at specific age (e.g., age 75) for annotation
  const age75Data = data.find(point => point.age === 75);
  
  // Format domain for Y axis (make sure we have proper scale)
  const maxValue = Math.max(...data.map(d => Math.max(d.conservative, d.moderate, d.aggressive)));
  const yAxisMax = maxValue * 1.1; // Add 10% margin

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
          domain={['dataMin', 'dataMax']}
          type="number"
          allowDecimals={false}
        />
        <YAxis 
          tickFormatter={(value) => formatChartCurrency(value)}
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: 12 }}
          domain={[0, yAxisMax]}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            // Transform the name for the tooltip
            const strategyName = name === "conservative" 
              ? "Conservative (3%)" 
              : name === "moderate" 
                ? "Moderate (4%)" 
                : "Aggressive (5%)";
            return [formatChartCurrency(value), strategyName];
          }}
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
        
        {/* Retirement age reference line */}
        {retirementAge && (
          <ReferenceLine
            x={retirementAge}
            stroke={colors.referenceLines}
            strokeDasharray="3 3"
            label={{
              value: "Retirement",
              position: "insideTopRight",
              fill: colors.text,
              fontSize: 12
            }}
          />
        )}
        
        {/* Depletion age reference lines */}
        {aggressiveDepletionAge && (
          <ReferenceLine
            x={aggressiveDepletionAge}
            stroke={colors.aggressive}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
        )}
        
        {moderateDepletionAge && (
          <ReferenceLine
            x={moderateDepletionAge}
            stroke={colors.moderate}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
        )}
        
        {/* If age 75 exists in our data, add reference markers */}
        {age75Data && (
          <ReferenceLine
            x={75}
            stroke={colors.referenceLines}
            strokeDasharray="3 3"
            strokeOpacity={0.4}
            label={{
              value: "Age: 75",
              position: "insideBottomRight",
              fill: colors.text,
              fontSize: 11
            }}
          />
        )}
        
        {/* Strategy lines */}
        <Line
          type="monotone"
          dataKey="conservative"
          stroke={colors.conservative}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 6 }}
          name="conservative"
        />
        
        <Line
          type="monotone"
          dataKey="moderate"
          stroke={colors.moderate}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 6 }}
          name="moderate"
        />
        
        <Line
          type="monotone"
          dataKey="aggressive"
          stroke={colors.aggressive}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 6 }}
          name="aggressive"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WithdrawalStrategyChart;
