
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";
import { formatCurrencyForTooltip } from "./utils/chartFormatters";
import { useMobile } from "@/hooks/use-mobile";

interface WithdrawalStrategyChartProps {
  data: WithdrawalStrategyDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const isMobile = useMobile();
    
    return (
      <div className={`bg-white p-${isMobile ? '2' : '3'} border border-neutral-200 shadow-sm rounded-md`}>
        <p className={`font-medium text-${isMobile ? 'xs' : 'sm'} mb-1`}>Age {dataPoint.age}</p>
        <div className={`space-y-${isMobile ? '0.5' : '1'} text-${isMobile ? '2xs' : 'xs'}`}>
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
  
  // Find retirement age for the reference line
  const retirementDataPoint = data.find(d => d.isRetirementAge);
  const retirementAge = retirementDataPoint?.age || 65;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ 
          top: 20, 
          right: isMobile ? 10 : 30, 
          left: isMobile ? 10 : 20, 
          bottom: 30 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="age" 
          tick={{ fontSize: isMobile ? 10 : 12 }} 
          tickMargin={isMobile ? 3 : 5}
          height={isMobile ? 25 : 30}
          padding={{ left: 10, right: 10 }}
          allowDataOverflow={false}
          interval={isMobile ? "preserveEnd" : 0}
          label={{ 
            value: 'Age', 
            position: 'insideBottom', 
            offset: -5,
            fontSize: isMobile ? 10 : 12
          }}
        />
        <YAxis 
          tickFormatter={(value) => `$${value >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}`}
          width={isMobile ? 50 : 70}
          tick={{ fontSize: isMobile ? 10 : 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine 
          x={retirementAge} 
          stroke="#9333ea" 
          strokeDasharray="3 3"
          label={{ 
            value: 'Retirement', 
            position: 'top', 
            fill: '#9333ea',
            fontSize: isMobile ? 9 : 12
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="conservative" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: isMobile ? 4 : 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="moderate" 
          stroke="#f59e0b" 
          strokeWidth={2} 
          dot={false}
          activeDot={{ r: isMobile ? 4 : 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="aggressive" 
          stroke="#ef4444" 
          strokeWidth={2} 
          dot={false}
          activeDot={{ r: isMobile ? 4 : 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WithdrawalStrategyChart;
