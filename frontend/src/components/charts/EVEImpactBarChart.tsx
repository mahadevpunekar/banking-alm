import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { EVEImpactPoint } from '@/api/types'
import { chartColors } from './chartTheme'
import { formatInrCr, formatPct } from '@/lib/format'

type Props = {
  data: EVEImpactPoint[]
  height?: number
}

export function EVEImpactBarChart({ data, height = 280 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
      >
        <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={{ stroke: chartColors.grid }}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="shockLabel"
          width={120}
          tick={{ fill: chartColors.axis, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value, _name, item) => {
            const p = item?.payload as EVEImpactPoint | undefined
            const pct = p ? formatPct(p.changeFromBasePct) : ''
            return [`${formatInrCr(Number(value))} (${pct})`, 'EVE']
          }}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${chartColors.grid}`,
            fontSize: 12,
          }}
        />
        <Bar dataKey="eveCr" name="EVE" radius={[0, 2, 2, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.shockLabel}
              fill={entry.shockBps === 0 ? chartColors.secondary : chartColors.primary}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
