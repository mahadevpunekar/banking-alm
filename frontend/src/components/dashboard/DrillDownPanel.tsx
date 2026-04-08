import { X } from 'lucide-react'
import type { DrillBreakdownRow } from '@/api/types'
import { formatInrCr } from '@/lib/format'

type Props = {
  open: boolean
  title: string
  subtitle?: string
  rows: DrillBreakdownRow[]
  onClose: () => void
}

export function DrillDownPanel({ open, title, subtitle, rows, onClose }: Props) {
  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px]"
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drill-title"
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            <h2 id="drill-title" className="text-sm font-semibold text-[#1E3A8A]">
              {title}
            </h2>
            {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="border-b border-slate-50 px-4 py-2 text-[10px] text-slate-500">
          Mock breakdown — product / region / counterparty. Connect to cube or data mart for production.
        </p>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[10px] font-semibold uppercase text-slate-500">
                <th className="pb-2 pr-2">Product</th>
                <th className="pb-2 pr-2">Region</th>
                <th className="pb-2 pr-2">Counterparty</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={`${r.product}-${i}`} className="text-slate-800">
                  <td className="py-2 pr-2 font-medium">{r.product}</td>
                  <td className="py-2 pr-2 text-slate-600">{r.region}</td>
                  <td className="py-2 pr-2 text-slate-600">{r.counterparty}</td>
                  <td className="py-2 text-right tabular-nums">{formatInrCr(r.amountCr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </aside>
    </>
  )
}
