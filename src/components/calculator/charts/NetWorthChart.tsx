
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { NetWorthDataPoint } from "@/lib/calculator/types";

interface NetWorthChartProps {
  data: NetWorthDataPoint[];
}

const NetWorthChart = ({ data }: NetWorthChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = useMemo(() => ({
    cash: "#3b82f6",
    retirement: "#8b5cf6",
    taxable: "#ec4899",
    realEstate: "#10b981",
    grid: isDark ? "#333" : "#e5e5e5",
    text: isDark ? "#ccc" : "#666",
  }), [isDark]);

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0';
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Find the retirement age point for reference line
  const retirementPoint = data.find(point => point.isRetirementAge);

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
          dataKey="realEstate"
          stackId="1"
          stroke={colors.realEstate}
          fill={colors.realEstate}
          name="Real Estate"
        />
        <Area
          type="monotone"
          dataKey="taxable"
          stackId="1"
          stroke={colors.taxable}
          fill={colors.taxable}
          name="Taxable Investments"
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
          dataKey="cash"
          stackId="1"
          stroke={colors.cash}
          fill={colors.cash}
          name="Cash Savings"
        />

        {retirementPoint && (
          <ReferenceLine
            x={retirementPoint.age}
            stroke="#0891b2"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            label={{ value: 'Retirement', position: 'insideTopRight', fontSize: 11, fill: '#0891b2' }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NetWorthChart;
