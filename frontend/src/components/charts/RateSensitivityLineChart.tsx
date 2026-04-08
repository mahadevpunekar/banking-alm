import type { ReactElement } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RateSensitivityPoint } from '@/api/types'
import { chartColors, enterprisePalette } from './chartTheme'
import { formatInrCr } from '@/lib/format'

type Props = {
  data: RateSensitivityPoint[]
  height?: number
  /** Shown in tooltip, e.g. control-bar scenario */
  scenarioLabel?: string
  onPointClick?: (tenor: string) => void
}

type TooltipRow = {
  dataKey?: string | number
  name?: string
  value?: number
  color?: string
}

function EnterpriseTooltip({
  active,
  payload,
  label,
  scenarioLabel,
}: {
  active?: boolean
  payload?: TooltipRow[]
  label?: string | number
  scenarioLabel: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-[#1E3A8A]">Scenario: {scenarioLabel}</p>
      <p className="mt-1 text-slate-600">Tenor: {label}</p>
      <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2">
        {payload.map((p) => (
          <li key={String(p.dataKey ?? p.name)} className="flex justify-between gap-4 tabular-nums">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-medium text-slate-900">{formatInrCr(Number(p.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

type DotRenderProps = {
  cx?: number
  cy?: number
  payload?: RateSensitivityPoint
  stroke?: string
  fill?: string
}

function sensitivityDot(
  fill: string,
  onPointClick?: (tenor: string) => void,
): (props: DotRenderProps) => ReactElement | null {
  return function Dot(props: DotRenderProps) {
    const { cx, cy, payload } = props
    if (cx == null || cy == null || !payload?.tenor) return null
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={fill}
        stroke="#fff"
        strokeWidth={1}
        className={onPointClick ? 'cursor-pointer' : undefined}
        onClick={() => onPointClick?.(payload.tenor)}
      />
    )
  }
}

export function RateSensitivityLineChart({
  data,
  height = 320,
  scenarioLabel = 'Base',
  onPointClick,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="tenor"
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={{ stroke: chartColors.grid }}
          tickLine={false}
        />
        <YAxis
          yAxisId="eve"
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
          label={{ value: 'EVE Δ', angle: -90, position: 'insideLeft', fontSize: 10, fill: chartColors.axis }}
        />
        <YAxis
          yAxisId="nii"
          orientation="right"
          tick={{ fill: chartColors.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
          label={{ value: 'NII Δ', angle: 90, position: 'insideRight', fontSize: 10, fill: chartColors.axis }}
        />
        <ReferenceArea
          yAxisId="eve"
          y1={-1300}
          y2={-700}
          fill={enterprisePalette.red}
          fillOpacity={0.08}
          strokeOpacity={0}
        />
        <ReferenceLine
          yAxisId="eve"
          y={0}
          stroke="#64748b"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <ReferenceLine
          yAxisId="nii"
          y={0}
          stroke="#94a3b8"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <Tooltip
          content={({ active, payload, label }) => (
            <EnterpriseTooltip
              active={active}
              payload={payload as unknown as TooltipRow[] | undefined}
              label={label}
              scenarioLabel={scenarioLabel}
            />
          )}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line
          yAxisId="eve"
          type="monotone"
          dataKey="eveImpactCr"
          name="EVE impact"
          stroke={chartColors.primary}
          strokeWidth={2}
          dot={sensitivityDot(chartColors.primary, onPointClick)}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="nii"
          type="monotone"
          dataKey="niiImpactCr"
          name="NII impact"
          stroke={enterprisePalette.green}
          strokeWidth={2}
          dot={sensitivityDot(enterprisePalette.green, onPointClick)}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
