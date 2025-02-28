
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
  LineChart,
  Line,
  ReferenceLine
} from "recharts";

interface ClientNetWorthChartProps {
  data: any[];
  variant?: "default" | "longevity" | "asset-categories";
}

const ClientNetWorthChart = ({ data, variant = "default" }: ClientNetWorthChartProps) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(item.value)
    }));
  }, [data]);

  // Find retirement age event in the data
  const retirementEvent = chartData.find(d => d.isRetirementAge);
  const retirementYear = retirementEvent?.year;

  const renderDefaultChart = () => (
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
          tickFormatter={(value) => `$${Math.abs(value) >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : `${(value / 1000).toFixed(0)}K`}`}
        />
        <Tooltip
          formatter={(value: number) => [
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value),
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

  const renderLongevityChart = () => (
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
          tickFormatter={(value) => `$${Math.abs(value) >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : `${(value / 1000).toFixed(0)}K`}`}
        />
        <Tooltip
          formatter={(value: number) => [
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value),
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

  const renderAssetCategoriesChart = () => (
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
          tickFormatter={(value) => `$${Math.abs(value) >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : `${(value / 1000).toFixed(0)}K`}`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value),
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

  switch (variant) {
    case "longevity":
      return renderLongevityChart();
    case "asset-categories":
      return renderAssetCategoriesChart();
    default:
      return renderDefaultChart();
  }
};

export default ClientNetWorthChart;
