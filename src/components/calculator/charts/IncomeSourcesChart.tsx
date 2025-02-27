
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { IncomeSourcesDataPoint } from "@/lib/calculator/types";

interface IncomeSourcesChartProps {
  data: IncomeSourcesDataPoint[];
}

const IncomeSourcesChart = ({ data }: IncomeSourcesChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = useMemo(() => ({
    employment: "#3b82f6",
    socialSecurity: "#8b5cf6",
    retirement: "#ec4899",
    pension: "#10b981",
    rmd: "#f59e0b", // Added color for RMDs
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
      <AreaChart
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
        <Area
          type="monotone"
          dataKey="employment"
          stackId="1"
          stroke={colors.employment}
          fill={colors.employment}
          name="Employment Income"
        />
        <Area
          type="monotone"
          dataKey="retirement"
          stackId="1"
          stroke={colors.retirement}
          fill={colors.retirement}
          name="Retirement Accounts"
        />
        <Area
          type="monotone"
          dataKey="rmd"
          stackId="1"
          stroke={colors.rmd}
          fill={colors.rmd}
          name="Required Minimum Distributions"
        />
        <Area
          type="monotone"
          dataKey="socialSecurity"
          stackId="1"
          stroke={colors.socialSecurity}
          fill={colors.socialSecurity}
          name="Social Security"
        />
        <Area
          type="monotone"
          dataKey="pension"
          stackId="1"
          stroke={colors.pension}
          fill={colors.pension}
          name="Pension"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default IncomeSourcesChart;
