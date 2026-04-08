import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { KpiExtension } from '@/api/types'
import { SparklineMini } from '@/components/ui/SparklineMini'
import { formatPct } from '@/lib/format'

function healthBadge(health: KpiExtension['health']) {
  switch (health) {
    case 'breach':
      return (
        <span className="rounded-sm border border-red-200/80 bg-red-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#b91c1c]">
          Breach
        </span>
      )
    case 'risk':
      return (
        <span className="rounded-sm border border-amber-200/80 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-900">
          Risk
        </span>
      )
    default:
      return (
        <span className="rounded-sm border border-emerald-200/80 bg-emerald-50/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-900">
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

const surface =
  'rounded-sm border border-slate-300/75 bg-white shadow-[0_1px_2px_rgba(12,25,41,0.04)] transition-[border-color,box-shadow] duration-150'

export function KpiCardEnterprise({ label, value, hint, icon, ext, onClick }: Props) {
  const up = ext.trendDirection === 'up'
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight
  const trendColor =
    ext.health === 'breach'
      ? 'text-[#b91c1c]'
      : ext.health === 'risk'
        ? 'text-amber-800'
        : up
          ? 'text-[#15803d]'
          : 'text-slate-600'

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        <div className="flex items-center gap-1.5">
          {healthBadge(ext.health)}
          {icon ? <span className="text-slate-400">{icon}</span> : null}
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-alm-heading)] sm:text-[1.6rem]">
        {value}
      </p>
      <div className={`mt-1 flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
        <TrendIcon className="h-3.5 w-3.5" aria-hidden />
        <span>{formatPct(Math.abs(ext.trendPct))}</span>
        <span className="font-normal text-slate-500">vs prior</span>
      </div>
      <div className="mt-3 border-t border-slate-50 pt-2">
        <SparklineMini values={ext.sparkline} positive={ext.health !== 'breach'} />
      </div>
      {hint ? <p className="mt-2.5 text-[11px] leading-snug text-slate-500">{hint}</p> : null}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${surface} w-full p-4 text-left hover:border-slate-400/90 hover:shadow-[0_2px_8px_rgba(12,25,41,0.06)] sm:p-5`}
      >
        {inner}
      </button>
    )
  }

  return <div className={`${surface} p-4 sm:p-5`}>{inner}</div>
}
