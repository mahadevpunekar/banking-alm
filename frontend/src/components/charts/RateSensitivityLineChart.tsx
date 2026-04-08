import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RateSensitivityPoint } from '@/api/types'
import { chartColors } from './chartTheme'
import { formatInrCr } from '@/lib/format'

type Props = {
  data: RateSensitivityPoint[]
  height?: number
}

export function RateSensitivityLineChart({ data, height = 320 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="tenor"
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={{ stroke: chartColors.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          formatter={(value) => formatInrCr(Number(value))}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${chartColors.grid}`,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="eveImpactCr"
          name="EVE impact"
          stroke={chartColors.primary}
          strokeWidth={2}
          dot={{ r: 3, fill: chartColors.primary }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="niiImpactCr"
          name="NII impact"
          stroke={chartColors.secondary}
          strokeWidth={2}
          dot={{ r: 3, fill: chartColors.secondary }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
