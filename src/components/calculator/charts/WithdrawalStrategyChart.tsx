
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";
import { formatCurrencyForTooltip, useChartDimensions, findDepletionAge } from "./utils/chartFormatters";
import { useMobile } from "@/hooks/use-mobile";

interface WithdrawalStrategyChartProps {
  data: WithdrawalStrategyDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    
    return (
      <div className="bg-white p-2 border border-neutral-200 shadow-md rounded-md text-xs sm:text-sm">
        <p className="font-medium mb-1">Age {dataPoint.age}</p>
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-neutral-600">Conservative: </span>
            <span className="ml-1 font-medium">{formatCurrencyForTooltip(dataPoint.conservative)}</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
            <span className="text-neutral-600">Moderate: </span>
            <span className="ml-1 font-medium">{formatCurrencyForTooltip(dataPoint.moderate)}</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-neutral-600">Aggressive: </span>
            <span className="ml-1 font-medium">{formatCurrencyForTooltip(dataPoint.aggressive)}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const WithdrawalStrategyChart = ({ data }: WithdrawalStrategyChartProps) => {
  const isMobile = useMobile();
  const { margins, axis, strokeWidth } = useChartDimensions();
  
  // Find retirement age for the reference line
  const retirementDataPoint = data.find(d => d.isRetirementAge);
  const retirementAge = retirementDataPoint?.age || 65;
  
  // Find depletion ages
  const conservativeDepletionAge = findDepletionAge(data, "conservative");
  const moderateDepletionAge = findDepletionAge(data, "moderate");
  const aggressiveDepletionAge = findDepletionAge(data, "aggressive");
  
  // Add annotations for portfolio depletion
  const annotations = [];
  if (conservativeDepletionAge) {
    annotations.push({
      age: conservativeDepletionAge,
      strategy: "Conservative",
      color: "#10b981"
    });
  }
  if (moderateDepletionAge) {
    annotations.push({
      age: moderateDepletionAge,
      strategy: "Moderate",
      color: "#f59e0b"
    });
  }
  if (aggressiveDepletionAge) {
    annotations.push({
      age: aggressiveDepletionAge,
      strategy: "Aggressive",
      color: "#ef4444"
    });
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={margins}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="age" 
            tick={{ fontSize: axis.fontSize }} 
            tickMargin={5}
            height={axis.xAxisHeight}
            padding={{ left: 10, right: 10 }}
            allowDataOverflow={false}
          />
          <YAxis 
            tickFormatter={(value) => value >= 1000000 ? `$${(value / 1000000).toFixed(0)}M` : value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`}
            width={axis.yAxisWidth}
            tick={{ fontSize: axis.fontSize }}
            domain={['auto', 'auto']}
            allowDataOverflow={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign={isMobile ? "bottom" : "top"}
            height={isMobile ? 36 : 30}
            iconSize={10}
            fontSize={axis.fontSize}
            wrapperStyle={{ paddingBottom: isMobile ? 10 : 0 }}
          />
          <ReferenceLine 
            x={retirementAge} 
            stroke="#9333ea" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Retirement', 
              position: 'top', 
              fill: '#9333ea',
              fontSize: axis.fontSize
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="conservative" 
            name="Conservative"
            stroke="#10b981" 
            strokeWidth={strokeWidth}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="moderate" 
            name="Moderate"
            stroke="#f59e0b" 
            strokeWidth={strokeWidth} 
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="aggressive" 
            name="Aggressive"
            stroke="#ef4444" 
            strokeWidth={strokeWidth} 
            dot={false}
            activeDot={{ r: 6 }}
          />
          
          {/* Add depletion annotations for each strategy */}
          {annotations.map((annotation, index) => (
            <ReferenceLine
              key={index}
              x={annotation.age}
              stroke={annotation.color}
              strokeDasharray="3 3"
              label={{
                value: `${annotation.strategy} Depleted`,
                position: 'top',
                fontSize: isMobile ? 8 : 10,
                fill: annotation.color,
                offset: 10 + (index * 15)
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Display depletion info summary */}
      {annotations.length > 0 && (
        <div className="mt-2 px-2 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
          {annotations.map((annotation, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: annotation.color }} 
              />
              <span>{annotation.strategy} depletes at age {annotation.age}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WithdrawalStrategyChart;
