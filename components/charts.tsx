"use client"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
} from "recharts"

interface ChartProps {
  data: any[]
  categories: string[]
  index: string
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  height?: number
}

export function LineChart({
  data,
  categories,
  index,
  colors,
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  height = 300,
}: ChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={index} />
          <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
          <Tooltip formatter={valueFormatter} />
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChart({
  data,
  categories,
  index,
  colors,
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  height = 300,
}: ChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={index} />
          <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
          <Tooltip formatter={valueFormatter} />
          <Legend />
          {categories.map((category, i) => (
            <Bar key={category} dataKey={category} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
