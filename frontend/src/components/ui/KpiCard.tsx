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
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {icon ? <span className="text-slate-400">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900 sm:text-[1.65rem]">
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
