
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { NetWorthDataPoint } from "@/lib/calculator/types";
import { useMobile } from "@/hooks/use-mobile";

interface NetWorthChartProps {
  data: NetWorthDataPoint[];
}

const NetWorthChart = ({ data }: NetWorthChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useMobile();

  const colors = useMemo(() => ({
    cash: "#3b82f6",
    retirement: "#8b5cf6",
    taxable: "#ec4899",
    realEstate: "#10b981",
    grid: isDark ? "#333" : "#e5e5e5",
    text: isDark ? "#ccc" : "#666",
  }), [isDark]);

  // Normalize data to prevent unrealistic projections
  const normalizedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(point => {
      // Apply reasonable caps to each asset type
      const normalizedCash = Math.min(point.cash || 0, 1000000); // Cap cash at $1M
      const normalizedRetirement = Math.min(point.retirement || 0, 10000000); // Cap retirement at $10M
      const normalizedTaxable = Math.min(point.taxable || 0, 5000000); // Cap taxable at $5M
      const normalizedRealEstate = Math.min(point.realEstate || 0, 8000000); // Cap real estate at $8M
      
      // Recalculate total with normalized values
      const normalizedTotal = normalizedCash + normalizedRetirement + normalizedTaxable + normalizedRealEstate;
      
      return {
        ...point,
        cash: normalizedCash,
        retirement: normalizedRetirement,
        taxable: normalizedTaxable,
        realEstate: normalizedRealEstate,
        total: normalizedTotal
      };
    });
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: isMobile ? 0 : 1,
    }).format(value);
  };

  // Find the retirement age point for reference line
  const retirementPoint = normalizedData.find(point => point.isRetirementAge);

  if (!normalizedData || normalizedData.length === 0) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={normalizedData}
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
          domain={[0, 'auto']}
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
            fontSize: isMobile ? "10px" : "12px",
          }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: isMobile ? "10px" : "12px", 
            paddingTop: 10,
            paddingLeft: isMobile ? 10 : 0,
            paddingRight: isMobile ? 10 : 0
          }} 
          verticalAlign="bottom"
          height={isMobile ? 50 : 36}
          layout={isMobile ? "vertical" : "horizontal"}
        />
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
            label={{
              value: 'Retirement',
              position: 'insideTopRight',
              fontSize: isMobile ? 9 : 11,
              fill: '#0891b2'
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NetWorthChart;
