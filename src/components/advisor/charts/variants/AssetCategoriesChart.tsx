
import { useMemo } from "react";
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from "recharts";
import { formatYAxisTick, formatCurrencyValue, getRetirementReference } from "../utils/formatters";

interface AssetCategoriesChartProps {
  data: any[];
}

const AssetCategoriesChart = ({ data }: AssetCategoriesChartProps) => {
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
        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        stackOffset="expand"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
          tickFormatter={formatYAxisTick}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrencyValue(value),
            name
          ]}
          labelFormatter={(label) => `Year: ${label}`}
          contentStyle={{ fontSize: '12px' }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="stocks"
          stackId="1"
          stroke="#3b82f6"
          fill="#3b82f6"
          name="Stocks"
        />
        <Area
          type="monotone"
          dataKey="bonds"
          stackId="1"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          name="Bonds"
        />
        <Area
          type="monotone"
          dataKey="cash"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          name="Cash"
        />
        <Area
          type="monotone"
          dataKey="realEstate"
          stackId="1"
          stroke="#f59e0b"
          fill="#f59e0b"
          name="Real Estate"
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

export default AssetCategoriesChart;
