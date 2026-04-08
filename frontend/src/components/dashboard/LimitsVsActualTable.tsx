import type { LimitVsActualRow } from '@/api/types'
import { Card } from '@/components/ui/Card'
import { formatInrCr } from '@/lib/format'

function statusBadge(status: LimitVsActualRow['status']) {
  switch (status) {
    case 'breach':
      return (
        <span className="inline-flex rounded-sm border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#b91c1c]">
          Breach
        </span>
      )
    case 'warning':
      return (
        <span className="inline-flex rounded-sm border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-900">
          Warning
        </span>
      )
    default:
      return (
        <span className="inline-flex rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-900">
          OK
        </span>
      )
  }
}

function fmtVal(row: LimitVsActualRow, v: number) {
  if (row.unit === 'pct') return `${v}%`
  return formatInrCr(v)
}

type Props = {
  rows: LimitVsActualRow[]
}

const th =
  'px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 first:pl-5 last:pr-5'

export function LimitsVsActualTable({ rows }: Props) {
  return (
    <Card
      title="Limits vs actual"
      description="Compliance view — liquidity, EVE, and NII against policy limits."
      className="mb-4"
    >
      <div className="overflow-x-auto rounded-sm border border-slate-300/80">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300/80 bg-slate-100/95">
              <th className={th}>Metric</th>
              <th className={`${th} text-right`}>Actual</th>
              <th className={`${th} text-right`}>Limit</th>
              <th className={`${th} text-center`}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white">
            {rows.map((r) => (
              <tr key={r.metric} className="hover:bg-slate-50/90">
                <td className="px-4 py-3 pl-5 font-medium text-[var(--color-alm-heading)]">{r.metric}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800">{fmtVal(r, r.actual)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600">{fmtVal(r, r.limit)}</td>
                <td className="px-4 py-3 pr-5 text-center">{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
