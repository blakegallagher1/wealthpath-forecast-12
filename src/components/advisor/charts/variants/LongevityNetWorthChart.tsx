
import { useMemo } from "react";
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { formatYAxisTick, formatCurrencyValue, getRetirementReference } from "../utils/formatters";

interface LongevityNetWorthChartProps {
  data: any[];
}

const LongevityNetWorthChart = ({ data }: LongevityNetWorthChartProps) => {
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
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
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
            "Portfolio Value"
          ]}
          labelFormatter={(label) => `Year: ${label}`}
          contentStyle={{ fontSize: '12px' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="conservativeValue"
          name="Conservative"
          stroke="#0891b2"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="aggressiveValue"
          name="Aggressive"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
        <Legend />
        {retirementYear && (
          <ReferenceLine
            x={retirementYear}
            stroke="#0891b2"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            label={{ value: 'Retirement', position: 'insideTopRight', fontSize: 11, fill: '#0891b2' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LongevityNetWorthChart;
