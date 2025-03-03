
import { useMemo } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";
import { formatChartCurrency } from "./utils/chartFormatters";
import ReferenceLines from "./withdrawal-strategy/ReferenceLines";
import StrategyLines from "./withdrawal-strategy/StrategyLines";

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
            const label = value === "3% Withdrawal Rate" 
              ? "Conservative (3%)" 
              : value === "4% Withdrawal Rate" 
                ? "Moderate (4%)" 
                : "Aggressive (5%)";
            return <span style={{ color: isDark ? "#fff" : "#000" }}>{label}</span>;
          }}
        />
        
        <ReferenceLines data={data} colors={colors} />
        <StrategyLines colors={colors} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WithdrawalStrategyChart;
