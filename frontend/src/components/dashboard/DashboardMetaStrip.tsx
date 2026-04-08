import type { DashboardMeta } from '@/api/types'

function minsAgo(iso: string): number {
  const t = new Date(iso).getTime()
  return Math.max(0, Math.round((Date.now() - t) / 60_000))
}

type Props = {
  meta: DashboardMeta
}

export function DashboardMetaStrip({ meta }: Props) {
  const m = minsAgo(meta.lastUpdatedIso)
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-sm border border-slate-300/70 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(12,25,41,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm border border-[#1e3a8a]/25 bg-[#1e3a8a]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1e3a8a]">
          RBI compliant
        </span>
        <span className="rounded-sm border border-slate-300/80 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          IRRBB Basel aligned
        </span>
      </div>
      <div className="text-left text-xs text-slate-600 sm:text-right">
        <p>
          <span className="font-semibold text-[var(--color-alm-heading)]">Last updated:</span>{' '}
          <span className="tabular-nums">{m}</span> min ago
        </p>
        <p className="mt-0.5 text-[10px] text-slate-500">Data source: {meta.dataSource}</p>
      </div>
    </div>
  )
}
