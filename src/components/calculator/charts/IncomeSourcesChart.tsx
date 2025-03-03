
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { IncomeSourcesDataPoint } from "@/lib/calculator/types";

interface IncomeSourcesChartProps {
  data: IncomeSourcesDataPoint[];
}

const IncomeSourcesChart = ({ data }: IncomeSourcesChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Filter out any data points with invalid values to prevent chart errors
  const validData = useMemo(() => {
    return data.filter(point => {
      // Ensure all numeric values are actually numbers
      return !Object.values(point).some(val => 
        typeof val === 'number' && (isNaN(val) || !isFinite(val))
      );
    });
  }, [data]);

  const colors = useMemo(() => ({
    primaryIncome: "#3b82f6",  // Blue for primary income
    spouseIncome: "#6366f1",   // Indigo for spouse income
    socialSecurity: "#8b5cf6", // Purple for social security
    spouseSocialSecurity: "#a855f7", // Light purple for spouse social security
    retirement: "#ec4899",     // Pink for retirement
    pension: "#10b981",        // Green for pension
    rmd: "#f59e0b",            // Amber for RMDs
    taxable: "#06b6d4",        // Cyan for taxable withdrawals
    grid: isDark ? "#333" : "#e5e5e5",
    text: isDark ? "#ccc" : "#666",
  }), [isDark]);

  // Find retirement age in data for reference line
  const retirementAge = validData.find(d => d.isRetirementAge)?.age;
  
  // Find Social Security start age if it exists in the data
  const ssStartAge = validData.findIndex(d => (d.socialSecurity || 0) > 0);

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
        data={validData}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis 
          dataKey="age" 
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: 12 }}
          height={30}
          padding={{ left: 10, right: 10 }}
          allowDataOverflow={false}
        />
        <YAxis 
          tickFormatter={formatCurrency}
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: 12 }}
          width={60}
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
          wrapperStyle={{ fontSize: "12px", paddingTop: 10 }} 
          verticalAlign="bottom"
          height={36}
        />
        <Area
          type="monotone"
          dataKey="primaryIncome"
          stackId="1"
          stroke={colors.primaryIncome}
          fill={colors.primaryIncome}
          name="Primary Income"
        />
        <Area
          type="monotone"
          dataKey="spouseIncome"
          stackId="1"
          stroke={colors.spouseIncome}
          fill={colors.spouseIncome}
          name="Spouse Income"
        />
        <Area
          type="monotone"
          dataKey="taxable"
          stackId="1"
          stroke={colors.taxable}
          fill={colors.taxable}
          name="Taxable Account Withdrawals"
        />
        <Area
          type="monotone"
          dataKey="retirement"
          stackId="1"
          stroke={colors.retirement}
          fill={colors.retirement}
          name="Retirement Account Withdrawals"
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
          name="Primary Social Security"
        />
        <Area
          type="monotone"
          dataKey="spouseSocialSecurity"
          stackId="1"
          stroke={colors.spouseSocialSecurity}
          fill={colors.spouseSocialSecurity}
          name="Spouse Social Security"
        />
        <Area
          type="monotone"
          dataKey="pension"
          stackId="1"
          stroke={colors.pension}
          fill={colors.pension}
          name="Pension"
        />
        
        {retirementAge && (
          <ReferenceLine 
            x={retirementAge} 
            stroke="#ff4500" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            label={{
              value: "Retirement Age",
              position: "top",
              fill: colors.text,
              fontSize: 12
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default IncomeSourcesChart;
