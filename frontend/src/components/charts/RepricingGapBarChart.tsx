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
import type { RepricingRow } from '@/api/types'
import { chartColors } from './chartTheme'
import { formatInrCr } from '@/lib/format'

type Props = {
  data: RepricingRow[]
  height?: number
}

export function RepricingGapBarChart({ data, height = 300 }: Props) {
  const chartData = data.map((r) => ({
    bucket: r.bucket,
    rsa: r.rateSensitiveAssetsCr,
    rsl: r.rateSensitiveLiabilitiesCr,
    gap: r.repricingGapCr,
  }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          formatter={(value) => formatInrCr(Number(value))}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${chartColors.grid}`,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="rsa" name="Rate-sensitive assets" fill={chartColors.primaryMuted} />
        <Bar dataKey="rsl" name="Rate-sensitive liabilities" fill={chartColors.secondary} />
        <Bar dataKey="gap" name="Repricing gap" fill={chartColors.primary} />
      </BarChart>
    </ResponsiveContainer>
  )
}
