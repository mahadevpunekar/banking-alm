import type { ReactNode } from 'react'

type KpiCardProps = {
  label: string
  value: string
  hint?: string
  trend?: { value: string; positive?: boolean }
  icon?: ReactNode
}

export function KpiCard({ label, value, hint, trend, icon }: KpiCardProps) {
  return (
    <div className="rounded-sm border border-slate-300/75 bg-white p-4 shadow-[0_1px_2px_rgba(12,25,41,0.04)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
        {icon ? <span className="text-slate-400">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-alm-heading)] sm:text-[1.65rem]">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {trend ? (
        <p
          className={`mt-2 text-xs font-medium ${
            trend.positive === false ? 'text-amber-700' : 'text-emerald-700'
          }`}
        >
          {trend.value}
        </p>
      ) : null}
    </div>
  )
}
