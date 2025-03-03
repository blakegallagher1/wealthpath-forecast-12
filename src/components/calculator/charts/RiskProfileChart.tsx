
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { RiskProfileDataPoint } from "@/lib/calculator/types";

interface RiskProfileChartProps {
  data: RiskProfileDataPoint[];
}

const RiskProfileChart = ({ data }: RiskProfileChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = useMemo(() => ({
    conservative: "#3b82f6",
    moderate: "#8b5cf6",
    aggressive: "#ec4899",
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

  // Find retirement age for reference line
  const retirementAge = data.find(d => d.isRetirementAge)?.age;

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
          name="Conservative (Low Risk)"
        />
        <Line
          type="monotone"
          dataKey="moderate"
          stroke={colors.moderate}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="Moderate (Medium Risk)"
        />
        <Line
          type="monotone"
          dataKey="aggressive"
          stroke={colors.aggressive}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          name="Aggressive (High Risk)"
        />
        
        {retirementAge && (
          <ReferenceLine
            x={retirementAge}
            stroke="#0891b2"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            label={{ value: 'Retirement', position: 'insideTopRight', fontSize: 11, fill: '#0891b2' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RiskProfileChart;
