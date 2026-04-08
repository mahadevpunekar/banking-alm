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
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded border border-[#1E3A8A]/25 bg-[#1E3A8A]/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#1E3A8A]">
          RBI compliant
        </span>
        <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          IRRBB Basel aligned
        </span>
      </div>
      <div className="text-right text-xs text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Last updated:</span> {m} min ago
        </p>
        <p className="text-[10px] text-slate-500">Data source: {meta.dataSource}</p>
      </div>
    </div>
  )
}
