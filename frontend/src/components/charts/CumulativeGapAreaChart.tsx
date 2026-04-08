import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { LiquidityBucketRow } from '@/api/types'
import { chartColors } from './chartTheme'
import { formatInrCr } from '@/lib/format'

type Props = {
  data: LiquidityBucketRow[]
  height?: number
}

export function CumulativeGapAreaChart({ data, height = 300 }: Props) {
  const chartData = data.map((r) => ({
    bucket: r.bucket,
    cumulative: r.cumulativeGapCr,
    net: r.netGapCr,
  }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cumGapFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.2} />
            <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="bucket"
          tick={{ fill: chartColors.axis, fontSize: 10 }}
          axisLine={{ stroke: chartColors.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value, name) => [
            formatInrCr(Number(value)),
            name === 'cumulative' ? 'Cumulative gap' : 'Net gap',
          ]}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${chartColors.grid}`,
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          name="cumulative"
          stroke={chartColors.primary}
          fill="url(#cumGapFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
