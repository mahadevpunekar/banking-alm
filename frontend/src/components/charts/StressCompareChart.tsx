import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { StressComparisonSeriesPoint } from '@/api/types'
import { chartColors } from './chartTheme'

type Props = {
  data: StressComparisonSeriesPoint[]
  height?: number
}

export function StressCompareChart({ data, height = 300 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={{ stroke: chartColors.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => Number(value).toLocaleString('en-IN', { maximumFractionDigits: 1 })}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${chartColors.grid}`,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="before" name="Before" fill={chartColors.before} radius={[2, 2, 0, 0]} />
        <Bar dataKey="after" name="After stress" fill={chartColors.after} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
