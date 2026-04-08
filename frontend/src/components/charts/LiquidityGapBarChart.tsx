import { useMemo, useState } from 'react'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { LiquidityGapBucketPoint } from '@/api/types'
import { chartColors, enterprisePalette } from './chartTheme'
import { formatInrCr } from '@/lib/format'

type ViewMode = 'bucket' | 'cumulative'

type Props = {
  data: LiquidityGapBucketPoint[]
  height?: number
  onBarClick?: (bucket: string, cumulativeCr: number) => void
}

export function LiquidityGapBarChart({ data, height = 320, onBarClick }: Props) {
  const [view, setView] = useState<ViewMode>('bucket')

  const chartData = useMemo(() => {
    return data.reduce<Array<LiquidityGapBucketPoint & { cumulativeCr: number }>>((acc, d) => {
      const prev = acc.length === 0 ? 0 : acc[acc.length - 1].cumulativeCr
      acc.push({ ...d, cumulativeCr: prev + d.gapCr })
      return acc
    }, [])
  }, [data])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">View</span>
        <div className="inline-flex rounded-sm border border-slate-300/80 bg-slate-100/80 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setView('bucket')}
            className={`rounded-sm px-2.5 py-1 font-semibold ${
              view === 'bucket' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-slate-600'
            }`}
          >
            Bucket + cumulative
          </button>
          <button
            type="button"
            onClick={() => setView('cumulative')}
            className={`rounded-sm px-2.5 py-1 font-semibold ${
              view === 'cumulative' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-slate-600'
            }`}
          >
            Cumulative only
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
            formatter={(value, name) => [formatInrCr(Number(value)), String(name)]}
            labelFormatter={(label) => `Bucket: ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${chartColors.grid}`,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {view === 'bucket' ? (
            <Bar
              dataKey="gapCr"
              name="Liquidity gap"
              radius={[2, 2, 0, 0]}
              onClick={(d) => {
                const payload = d?.payload as (typeof chartData)[0] | undefined
                if (payload && onBarClick) onBarClick(payload.bucket, payload.cumulativeCr)
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.gapCr >= 0 ? enterprisePalette.green : enterprisePalette.red}
                  className={onBarClick ? 'cursor-pointer' : undefined}
                />
              ))}
            </Bar>
          ) : null}
          <Line
            type="monotone"
            dataKey="cumulativeCr"
            name="Cumulative gap"
            stroke={chartColors.primary}
            strokeWidth={view === 'cumulative' ? 2.5 : 2}
            dot={{ r: view === 'cumulative' ? 4 : 2, fill: chartColors.primary }}
            activeDot={{ r: 6 }}
            onClick={(d) => {
              const p = (d as { payload?: (typeof chartData)[0] })?.payload
              if (p && onBarClick) onBarClick(p.bucket, p.cumulativeCr)
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-2 text-[10px] text-slate-500">
        Negative gaps in red, positive in green. Cumulative line overlays structural running gap.
      </p>
    </div>
  )
}
