
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { SocialSecurityDataPoint } from "@/lib/calculator/types";
import { useMobile } from "@/hooks/use-mobile";

interface SocialSecurityChartProps {
  data: SocialSecurityDataPoint[];
}

const SocialSecurityChart = ({ data }: SocialSecurityChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useMobile();

  const colors = useMemo(() => ({
    bars: ["#3b82f6", "#8b5cf6", "#ec4899"],
    grid: isDark ? "#333" : "#e5e5e5",
    text: isDark ? "#ccc" : "#666",
  }), [isDark]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: isMobile ? 10 : 30,
          left: isMobile ? 10 : 20,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis 
          dataKey="claimingAge" 
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: isMobile ? 10 : 12 }}
          label={{ 
            value: "Claiming Age", 
            position: "insideBottom", 
            offset: -5, 
            fill: colors.text,
            fontSize: isMobile ? 10 : 12
          }}
          height={isMobile ? 40 : 50}
        />
        <YAxis 
          tickFormatter={formatCurrency}
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: isMobile ? 10 : 12 }}
          label={{ 
            value: "Monthly Benefit", 
            angle: -90, 
            position: "insideLeft", 
            style: { textAnchor: "middle" }, 
            fill: colors.text,
            fontSize: isMobile ? 10 : 12
          }}
          width={isMobile ? 60 : 80}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Monthly Benefit"]}
          labelFormatter={(age) => `Claiming Age: ${age}`}
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            borderColor: colors.grid,
            borderRadius: "0.375rem",
            color: colors.text,
            fontSize: isMobile ? "10px" : "12px"
          }}
        />
        <Bar dataKey="monthlyBenefit" name="Monthly Benefit" barSize={isMobile ? 20 : 30}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors.bars[index % colors.bars.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SocialSecurityChart;
