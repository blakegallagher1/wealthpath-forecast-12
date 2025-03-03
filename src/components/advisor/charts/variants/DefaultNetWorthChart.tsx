
import { useMemo } from "react";
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine
} from "recharts";
import { formatYAxisTick, formatCurrencyValue, getRetirementReference } from "../utils/formatters";

interface DefaultNetWorthChartProps {
  data: any[];
}

const DefaultNetWorthChart = ({ data }: DefaultNetWorthChartProps) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedValue: formatCurrencyValue(item.value)
    }));
  }, [data]);

  // Find retirement year
  const retirementYear = getRetirementReference(chartData);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
        <defs>
          <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
          tickFormatter={formatYAxisTick}
        />
        <Tooltip
          formatter={(value: number) => [
            formatCurrencyValue(value),
            "Net Worth"
          ]}
          labelFormatter={(label) => `Year: ${label}`}
          contentStyle={{ fontSize: '12px' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#netWorthGradient)"
          strokeWidth={2}
        />
        {retirementYear && (
          <ReferenceLine
            x={retirementYear}
            stroke="#0891b2"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            label={{ value: 'Retirement', position: 'insideTopRight', fontSize: 11, fill: '#0891b2' }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DefaultNetWorthChart;
