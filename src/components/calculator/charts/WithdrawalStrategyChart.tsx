
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";

interface WithdrawalStrategyChartProps {
  data: WithdrawalStrategyDataPoint[];
}

const WithdrawalStrategyChart = ({ data }: WithdrawalStrategyChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = useMemo(() => ({
    conservative: "#10b981",
    moderate: "#f59e0b",
    aggressive: "#ef4444",
    grid: isDark ? "#333" : "#e5e5e5",
    text: isDark ? "#ccc" : "#666",
  }), [isDark]);

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
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Line
          type="monotone"
          dataKey="conservative"
          stroke={colors.conservative}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="3% Withdrawal Rate"
        />
        <Line
          type="monotone"
          dataKey="moderate"
          stroke={colors.moderate}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="4% Withdrawal Rate"
        />
        <Line
          type="monotone"
          dataKey="aggressive"
          stroke={colors.aggressive}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="5% Withdrawal Rate"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WithdrawalStrategyChart;
