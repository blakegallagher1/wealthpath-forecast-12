
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Area, ComposedChart } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { RiskProfileDataPoint } from "@/lib/calculator/types";
import { useMobile } from "@/hooks/use-mobile";
import { useChartDimensions } from "./utils/chartFormatters";

interface RiskProfileChartProps {
  data: RiskProfileDataPoint[];
}

const RiskProfileChart = ({ data }: RiskProfileChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useMobile();
  const { margins, axis, strokeWidth } = useChartDimensions();

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

  // Calculate percentage differences between strategies at retirement age
  const retirementData = data.find(d => d.isRetirementAge);
  
  // Filter data to ensure we only display valid points
  const validData = useMemo(() => {
    return data.filter(point => 
      !isNaN(point.conservative) && 
      !isNaN(point.moderate) && 
      !isNaN(point.aggressive)
    );
  }, [data]);

  const comparisons = useMemo(() => {
    if (!retirementData) return null;
    const conservative = retirementData.conservative;
    const moderate = retirementData.moderate;
    const aggressive = retirementData.aggressive;
    
    const moderateVsConservative = ((moderate - conservative) / conservative * 100).toFixed(1);
    const aggressiveVsConservative = ((aggressive - conservative) / conservative * 100).toFixed(1);
    
    return {
      moderateVsConservative,
      aggressiveVsConservative
    };
  }, [retirementData]);

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={validData}
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis 
            dataKey="age" 
            stroke={colors.text}
            tickLine={{ stroke: colors.grid }}
            tick={{ fill: colors.text, fontSize: axis.fontSize }}
            height={axis.xAxisHeight}
            padding={{ left: 10, right: 10 }}
            allowDataOverflow={false}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            stroke={colors.text}
            tickLine={{ stroke: colors.grid }}
            tick={{ fill: colors.text, fontSize: axis.fontSize }}
            width={axis.yAxisWidth}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              // Map strategy names to more readable format
              const strategyName = 
                name === "conservative" ? "Conservative" :
                name === "moderate" ? "Moderate" :
                name === "aggressive" ? "Aggressive" : name;
              
              return [formatCurrency(value), strategyName];
            }}
            labelFormatter={(age) => `Age: ${age}`}
            contentStyle={{
              backgroundColor: isDark ? "#333" : "#fff",
              borderColor: colors.grid,
              borderRadius: "0.375rem",
              color: colors.text,
              fontSize: axis.fontSize
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: axis.fontSize, paddingTop: 10 }} 
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              switch(value) {
                case "conservative": return "Conservative (Low Risk)";
                case "moderate": return "Moderate (Medium Risk)";
                case "aggressive": return "Aggressive (High Risk)";
                default: return value;
              }
            }}
          />
          
          {/* Use Areas for better visual distinction */}
          <Area
            type="monotone"
            dataKey="conservative"
            stroke={colors.conservative}
            fill={colors.conservative}
            fillOpacity={0.1}
            strokeWidth={strokeWidth}
            dot={false}
            activeDot={{ r: 6 }}
            name="conservative"
          />
          <Area
            type="monotone"
            dataKey="moderate"
            stroke={colors.moderate}
            fill={colors.moderate}
            fillOpacity={0.1}
            strokeWidth={strokeWidth}
            dot={false}
            activeDot={{ r: 6 }}
            name="moderate"
          />
          <Area
            type="monotone"
            dataKey="aggressive"
            stroke={colors.aggressive}
            fill={colors.aggressive}
            fillOpacity={0.1}
            strokeWidth={strokeWidth}
            dot={false}
            activeDot={{ r: 6 }}
            name="aggressive"
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
                fontSize: axis.fontSize, 
                fill: '#0891b2',
                offset: 10
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Add strategy comparison insights */}
      {comparisons && (
        <div className="text-xs absolute bottom-0 left-0 w-full px-3 py-1">
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-2'} gap-2 text-center bg-muted/30 rounded-md p-1`}>
            <div>
              <span className="font-medium">Moderate vs Conservative at retirement:</span>
              <span className={`ml-1 ${parseFloat(comparisons.moderateVsConservative) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(comparisons.moderateVsConservative) > 0 ? '+' : ''}{comparisons.moderateVsConservative}%
              </span>
            </div>
            <div>
              <span className="font-medium">Aggressive vs Conservative at retirement:</span>
              <span className={`ml-1 ${parseFloat(comparisons.aggressiveVsConservative) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(comparisons.aggressiveVsConservative) > 0 ? '+' : ''}{comparisons.aggressiveVsConservative}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskProfileChart;
