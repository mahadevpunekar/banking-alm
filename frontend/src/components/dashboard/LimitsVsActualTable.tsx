import type { LimitVsActualRow } from '@/api/types'
import { Card } from '@/components/ui/Card'
import { formatInrCr } from '@/lib/format'

function statusBadge(status: LimitVsActualRow['status']) {
  switch (status) {
    case 'breach':
      return (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[#DC2626]">
          Breach
        </span>
      )
    case 'warning':
      return (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
          Warning
        </span>
      )
    default:
      return (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[#16A34A]">
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

export function LimitsVsActualTable({ rows }: Props) {
  return (
    <Card
      title="Limits vs actual"
      description="Compliance view — liquidity, EVE, and NII against policy limits."
      className="mb-4"
    >
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Metric
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                Actual
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                Limit
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r) => (
              <tr key={r.metric} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium text-slate-900">{r.metric}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-800">{fmtVal(r, r.actual)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600">{fmtVal(r, r.limit)}</td>
                <td className="px-4 py-3 text-center">{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
