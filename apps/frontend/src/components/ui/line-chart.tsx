import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LineChartComponentProps {
  data: Array<{ timestamp: number; value: number }>;
  label?: string;
  color?: string;
  title: string;
  subtitle?: string;
}

// could be resued for memory usage or cpu usage
export default function LineChartComponent({
  data,
  label = "Usage",
  color = "var(--tw-chart1)",
  title,
  subtitle,
}: LineChartComponentProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-2 text-black dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          {subtitle}
        </div>
      )}
      <ResponsiveContainer height={300} width="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid className="stroke-gray-300 dark:stroke-gray-600" strokeDasharray="3 3" />
          <XAxis
            angle={-45}
            className="text-xs"
            dataKey="timestamp"
            height={80}
            textAnchor="end"
            tick={{ fill: "currentColor" }}
            tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
          />
          <YAxis
            className="text-xs"
            label={{ value: `${label} (%)`, angle: -90, position: "insideLeft" }}
            tick={{ fill: "currentColor" }}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
            }}
            formatter={(value) => `${value}%`}
            labelFormatter={(ts) => new Date(ts).toLocaleTimeString()}
            labelStyle={{ color: "#666" }}
          />
          <Line
            activeDot={{ r: 6 }}
            dataKey="value"
            dot={{ r: 3 }}
            name={label}
            stroke={color}
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
