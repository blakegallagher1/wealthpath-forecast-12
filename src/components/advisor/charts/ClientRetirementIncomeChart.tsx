
import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  LineChart,
  Line
} from "recharts";

interface ClientRetirementIncomeChartProps {
  data: any[];
  variant?: "default" | "social-security";
  showLegend?: boolean;
}

const ClientRetirementIncomeChart = ({ 
  data, 
  variant = "default",
  showLegend = false
}: ClientRetirementIncomeChartProps) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedTotal: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(item.total)
    }));
  }, [data]);

  // Find retirement age event in the data
  const retirementEvent = chartData.find(d => d.isRetirementAge);
  const retirementAge = retirementEvent?.age;

  const renderDefaultChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        stackOffset="sign"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="age"
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
          formatter={(value: number, name: string) => [
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value),
            name
          ]}
          labelFormatter={(label) => `Age: ${label}`}
          contentStyle={{ fontSize: '12px' }}
        />
        {showLegend && <Legend />}
        <Bar dataKey="socialSecurity" stackId="a" fill="#3b82f6" name="Social Security" />
        <Bar dataKey="pension" stackId="a" fill="#8b5cf6" name="Pension" />
        <Bar dataKey="workIncome" stackId="a" fill="#f59e0b" name="Work Income" />
        <Bar dataKey="investmentIncome" stackId="a" fill="#10b981" name="Investment Income" />
        <Bar dataKey="otherIncome" stackId="a" fill="#6b7280" name="Other Income" />
        {retirementAge && (
          <ReferenceLine
            x={retirementAge}
            stroke="#0891b2"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            label={{ value: 'Retirement', position: 'insideTopRight', fontSize: 11, fill: '#0891b2' }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderSocialSecurityChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="claimingAge"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value),
            name
          ]}
          labelFormatter={(label) => `Claiming Age: ${label}`}
          contentStyle={{ fontSize: '12px' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="monthlyBenefit"
          name="Monthly Benefit"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ stroke: '#3b82f6', strokeWidth: 2, r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="lifetimeTotal"
          name="Lifetime Total (Right Axis)"
          stroke="#10b981"
          strokeWidth={2}
          yAxisId="right"
          dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${Math.abs(value) >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`}`}
        />
        <ReferenceLine
          x={retirementAge}
          stroke="#f59e0b"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          label={{ value: 'Opt. Claiming Age', position: 'insideBottomRight', fontSize: 11, fill: '#f59e0b' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  switch (variant) {
    case "social-security":
      return renderSocialSecurityChart();
    default:
      return renderDefaultChart();
  }
};

export default ClientRetirementIncomeChart;
