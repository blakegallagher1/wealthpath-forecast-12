
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { RiskProfileDataPoint } from "@/lib/calculator/types";
import { useMobile } from "@/hooks/use-mobile";

interface RiskProfileChartProps {
  data: RiskProfileDataPoint[];
}

const RiskProfileChart = ({ data }: RiskProfileChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useMobile();

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
      maximumFractionDigits: isMobile ? 0 : 1,
    }).format(value);
  };

  // Find retirement age for reference line
  const retirementAge = data.find(d => d.isRetirementAge)?.age;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
          dataKey="age" 
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: isMobile ? 10 : 12 }}
          height={isMobile ? 25 : 30}
          padding={{ left: 10, right: 10 }}
          allowDataOverflow={false}
          interval={isMobile ? "preserveEnd" : 0}
        />
        <YAxis 
          tickFormatter={formatCurrency}
          stroke={colors.text}
          tickLine={{ stroke: colors.grid }}
          tick={{ fill: colors.text, fontSize: isMobile ? 10 : 12 }}
          width={isMobile ? 50 : 70}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), ""]}
          labelFormatter={(age) => `Age: ${age}`}
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            borderColor: colors.grid,
            borderRadius: "0.375rem",
            color: colors.text,
            fontSize: isMobile ? "10px" : "12px"
          }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? "9px" : "12px", 
            paddingTop: 10 
          }} 
          verticalAlign="bottom"
          height={isMobile ? 50 : 36}
          layout={isMobile ? "vertical" : "horizontal"}
        />
        <Line
          type="monotone"
          dataKey="conservative"
          stroke={colors.conservative}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: isMobile ? 4 : 6 }}
          name="Conservative (Low Risk)"
        />
        <Line
          type="monotone"
          dataKey="moderate"
          stroke={colors.moderate}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: isMobile ? 4 : 6 }}
          name="Moderate (Medium Risk)"
        />
        <Line
          type="monotone"
          dataKey="aggressive"
          stroke={colors.aggressive}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: isMobile ? 4 : 6 }}
          name="Aggressive (High Risk)"
        />
        
        {retirementAge && (
          <ReferenceLine
            x={retirementAge}
            stroke="#0891b2"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            label={{ 
              value: 'Retirement', 
              position: 'insideTopRight', 
              fontSize: isMobile ? 9 : 11, 
              fill: '#0891b2',
              offset: isMobile ? 5 : 10
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RiskProfileChart;
