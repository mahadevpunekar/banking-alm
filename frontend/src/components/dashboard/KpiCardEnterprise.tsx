import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { KpiExtension } from '@/api/types'
import { SparklineMini } from '@/components/ui/SparklineMini'
import { formatPct } from '@/lib/format'

function healthBadge(health: KpiExtension['health']) {
  switch (health) {
    case 'breach':
      return (
        <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#DC2626]">
          Breach
        </span>
      )
    case 'risk':
      return (
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">
          Risk
        </span>
      )
    default:
      return (
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#16A34A]">
          Good
        </span>
      )
  }
}

type Props = {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  ext: KpiExtension
  onClick?: () => void
}

export function KpiCardEnterprise({ label, value, hint, icon, ext, onClick }: Props) {
  const up = ext.trendDirection === 'up'
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight
  const trendColor =
    ext.health === 'breach'
      ? 'text-[#DC2626]'
      : ext.health === 'risk'
        ? 'text-amber-700'
        : up
          ? 'text-[#16A34A]'
          : 'text-slate-600'

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <div className="flex items-center gap-1.5">
          {healthBadge(ext.health)}
          {icon ? <span className="text-slate-400">{icon}</span> : null}
        </div>
      </div>
      <p className="mt-2 min-w-0 text-xl font-semibold tabular-nums tracking-tight leading-tight text-slate-900 sm:text-[1.5rem] xl:whitespace-nowrap">
        {value}
      </p>
      <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
        <TrendIcon className="h-3.5 w-3.5" aria-hidden />
        <span>{formatPct(Math.abs(ext.trendPct))}</span>
        <span className="font-normal text-slate-500">vs prior</span>
      </div>
      <div className="mt-2">
        <SparklineMini values={ext.sparkline} positive={ext.health !== 'breach'} />
      </div>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#1E3A8A]/40 hover:shadow-md sm:p-5"
      >
        {inner}
      </button>
    )
  }

  return <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">{inner}</div>
}
