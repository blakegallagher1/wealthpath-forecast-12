
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, ZAxis, Legend, ReferenceLine } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { SocialSecurityDataPoint } from "@/lib/calculator/types";
import { useMobile } from "@/hooks/use-mobile";
import { useChartDimensions } from "./utils/chartFormatters";

interface SocialSecurityChartProps {
  data: SocialSecurityDataPoint[];
}

const CustomLabel = (props: any) => {
  const { x, y, width, value, index } = props;
  // Only show every other label on mobile to prevent crowding
  if (window.innerWidth < 768 && index % 2 !== 0) return null;
  
  return (
    <text 
      x={x + width / 2} 
      y={y - 6} 
      fill="#666" 
      textAnchor="middle" 
      fontSize={10}
    >
      {value.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      })}
    </text>
  );
};

const SocialSecurityChart = ({ data }: SocialSecurityChartProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useMobile();
  const { margins, axis, strokeWidth } = useChartDimensions();

  const colors = useMemo(() => ({
    bars: ["#3b82f6", "#8b5cf6", "#ec4899"],
    optimal: "#10b981",
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

  // Find optimal claiming age (highest lifetime total)
  const optimalAge = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    let maxTotal = 0;
    let bestAge = 0;
    
    data.forEach(point => {
      if (point.lifetimeTotal && point.lifetimeTotal > maxTotal) {
        maxTotal = point.lifetimeTotal;
        bestAge = point.claimingAge;
      }
    });
    
    return bestAge || null;
  }, [data]);
  
  // Calculate percentage differences
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Find age 62 benefit as baseline
    const baselinePoint = data.find(d => d.claimingAge === 62);
    const baselineBenefit = baselinePoint?.monthlyBenefit || 0;
    
    return data.map(point => ({
      ...point,
      percentIncrease: baselineBenefit > 0 
        ? ((point.monthlyBenefit - baselineBenefit) / baselineBenefit * 100).toFixed(1) 
        : "0.0",
      isOptimal: point.claimingAge === optimalAge
    }));
  }, [data, optimalAge]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={!isMobile} />
          <XAxis 
            dataKey="claimingAge" 
            stroke={colors.text}
            tickLine={{ stroke: colors.grid }}
            tick={{ fill: colors.text, fontSize: axis.fontSize }}
            label={!isMobile ? { 
              value: "Claiming Age", 
              position: "insideBottom", 
              offset: -5, 
              fill: colors.text,
              fontSize: axis.fontSize
            } : undefined}
            height={axis.xAxisHeight}
          />
          <YAxis 
            tickFormatter={(value) => isMobile ? `$${Math.floor(value/1000)}K` : formatCurrency(value)}
            stroke={colors.text}
            tickLine={{ stroke: colors.grid }}
            tick={{ fill: colors.text, fontSize: axis.fontSize }}
            width={axis.yAxisWidth}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const displayName = name === "monthlyBenefit" 
                ? "Monthly Benefit" 
                : name === "monthlySpouseBenefit"
                ? "Spouse Monthly Benefit"
                : name;
              
              return [formatCurrency(value), displayName];
            }}
            labelFormatter={(age) => `Claiming Age: ${age}`}
            contentStyle={{
              backgroundColor: isDark ? "#333" : "#fff",
              borderColor: colors.grid,
              borderRadius: "0.375rem",
              color: colors.text,
              fontSize: axis.fontSize
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: axis.fontSize }} 
            formatter={(value) => {
              return value === "monthlyBenefit" 
                ? "Monthly Benefit" 
                : value === "monthlySpouseBenefit"
                ? "Spouse Benefit"
                : value;
            }}
          />
          <Bar 
            dataKey="monthlyBenefit" 
            name="monthlyBenefit" 
            barSize={isMobile ? 20 : 30}
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isOptimal ? colors.optimal : colors.bars[index % colors.bars.length]} 
                stroke={entry.isOptimal ? "#057a55" : undefined}
                strokeWidth={entry.isOptimal ? 1 : 0}
              />
            ))}
            {!isMobile && (
              <LabelList 
                dataKey="monthlyBenefit" 
                position="top" 
                content={<CustomLabel />} 
              />
            )}
          </Bar>
          
          {optimalAge && (
            <ReferenceLine
              x={optimalAge}
              stroke={colors.optimal}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              label={{
                value: 'Optimal',
                position: 'top',
                fill: colors.optimal,
                fontSize: axis.fontSize
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
      
      {/* Add insight section */}
      {processedData.length > 0 && (
        <div className="mt-2 px-2">
          <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-muted/40 rounded-md">
              <p className="font-medium">Key Insights:</p>
              <ul className="mt-1 list-disc pl-4 space-y-1">
                <li>
                  Claiming at age 70 vs 62: 
                  <span className="font-medium ml-1 text-green-600">
                    +{processedData.find(d => d.claimingAge === 70)?.percentIncrease || "0"}%
                  </span>
                </li>
                {optimalAge && (
                  <li>
                    Optimal claiming age for maximum lifetime benefits: 
                    <span className="font-medium ml-1">{optimalAge}</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="p-2 bg-muted/40 rounded-md">
              <p className="font-medium">Monthly Benefit Comparison:</p>
              <div className="mt-1 flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span>Age 62 (earliest):</span>
                  <span>
                    {formatCurrency(processedData.find(d => d.claimingAge === 62)?.monthlyBenefit || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Age 67 (full retirement):</span>
                  <span>
                    {formatCurrency(processedData.find(d => d.claimingAge === 67)?.monthlyBenefit || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Age 70 (maximum):</span>
                  <span>
                    {formatCurrency(processedData.find(d => d.claimingAge === 70)?.monthlyBenefit || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialSecurityChart;
