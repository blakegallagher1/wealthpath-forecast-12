
import React from "react";
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
import { formatCurrency } from "@/lib/calculator/formatters";

interface DebtPayoffDataPoint {
  age: number;
  year?: number;
  mortgageBalance: number;
  studentLoanBalance: number;
  autoLoanBalance: number;
  creditCardBalance: number;
  totalDebt: number;
  isRetirementAge?: boolean;
}

interface DebtPayoffChartProps {
  data: DebtPayoffDataPoint[];
}

const DebtPayoffChart = ({ data }: DebtPayoffChartProps) => {
  // Find retirement age for reference line
  const retirementPoint = data.find((point) => point.isRetirementAge);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="age"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e5e5" }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e5e5e5" }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === "totalDebt" ? "Total Debt" :
            name === "mortgageBalance" ? "Mortgage" :
            name === "studentLoanBalance" ? "Student Loans" :
            name === "autoLoanBalance" ? "Auto Loans" :
            name === "creditCardBalance" ? "Credit Cards" : name
          ]}
          labelFormatter={(age) => `Age: ${age}`}
        />
        <Legend 
          wrapperStyle={{ paddingTop: 10 }}
          formatter={(value) => 
            value === "totalDebt" ? "Total Debt" :
            value === "mortgageBalance" ? "Mortgage" :
            value === "studentLoanBalance" ? "Student Loans" :
            value === "autoLoanBalance" ? "Auto Loans" :
            value === "creditCardBalance" ? "Credit Cards" : value
          }
        />
        <Area
          type="monotone"
          dataKey="totalDebt"
          name="totalDebt"
          stroke="#6b7280"
          fill="#6b7280"
          fillOpacity={0.2}
          strokeWidth={2}
          stackId="1"
        />
        <Area
          type="monotone"
          dataKey="mortgageBalance"
          name="mortgageBalance"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.5}
        />
        <Area
          type="monotone"
          dataKey="studentLoanBalance"
          name="studentLoanBalance"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.5}
        />
        <Area
          type="monotone"
          dataKey="autoLoanBalance"
          name="autoLoanBalance"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.5}
        />
        <Area
          type="monotone"
          dataKey="creditCardBalance"
          name="creditCardBalance"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.5}
        />
        {retirementPoint && (
          <ReferenceLine
            x={retirementPoint.age}
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: "Retirement",
              position: "top",
              fill: "#f59e0b",
              fontSize: 12,
            }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DebtPayoffChart;
