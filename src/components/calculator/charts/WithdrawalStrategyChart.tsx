
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";
import { formatCurrencyForTooltip } from "./utils/chartFormatters";

interface WithdrawalStrategyChartProps {
  data: WithdrawalStrategyDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    
    return (
      <div className="bg-white p-3 border border-neutral-200 shadow-sm rounded-md">
        <p className="font-medium text-sm mb-1">Age {dataPoint.age}</p>
        <div className="space-y-1 text-xs">
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
  // Find retirement age for the reference line
  const retirementDataPoint = data.find(d => d.isRetirementAge);
  const retirementAge = retirementDataPoint?.age || 65;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="age" 
          tick={{ fontSize: 12 }} 
          tickMargin={5}
          label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          tickFormatter={(value) => `$${value >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}`}
          width={60}
          tick={{ fontSize: 12 }}
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
            fontSize: 12
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="conservative" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="moderate" 
          stroke="#f59e0b" 
          strokeWidth={2} 
          dot={false}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="aggressive" 
          stroke="#ef4444" 
          strokeWidth={2} 
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WithdrawalStrategyChart;
