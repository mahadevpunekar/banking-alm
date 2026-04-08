import { ArrowDown, ArrowUp, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ExposureRow } from '@/api/types'
import { formatInrCr } from '@/lib/format'

type SortKey = 'name' | 'amountCr' | 'sharePct' | 'riskRating' | 'maturityBucket'

type Props = {
  data: ExposureRow[]
  onRowClick: (row: ExposureRow) => void
}

function sortGlyph(k: SortKey, sortKey: SortKey, sortDir: 'asc' | 'desc') {
  if (sortKey !== k) return null
  return sortDir === 'asc' ? (
    <ArrowUp className="inline h-3 w-3" aria-hidden />
  ) : (
    <ArrowDown className="inline h-3 w-3" aria-hidden />
  )
}

export function TopExposuresTable({ data, onRowClick }: Props) {
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('amountCr')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filteredSorted = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const rows = q
      ? data.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.segment.toLowerCase().includes(q) ||
            (r.riskRating ?? '').toLowerCase().includes(q) ||
            (r.maturityBucket ?? '').toLowerCase().includes(q),
        )
      : [...data]

    rows.sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [data, filter, sortKey, sortDir])

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(k)
      setSortDir(k === 'name' || k === 'riskRating' || k === 'maturityBucket' ? 'asc' : 'desc')
    }
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Filter exposures…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-md border border-slate-200 py-2 pl-8 pr-3 text-sm text-slate-900 shadow-sm"
          />
        </label>
        <p className="text-xs text-slate-500">{filteredSorted.length} row(s)</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-3">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-[#1E3A8A]"
                  onClick={() => toggleSort('name')}
                >
                  Exposure {sortGlyph('name', sortKey, sortDir)}
                </button>
              </th>
              <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Segment
              </th>
              <th className="px-3 py-3">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-[#1E3A8A]"
                  onClick={() => toggleSort('riskRating')}
                >
                  Risk rating {sortGlyph('riskRating', sortKey, sortDir)}
                </button>
              </th>
              <th className="px-3 py-3">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-[#1E3A8A]"
                  onClick={() => toggleSort('maturityBucket')}
                >
                  Maturity {sortGlyph('maturityBucket', sortKey, sortDir)}
                </button>
              </th>
              <th className="px-3 py-3 text-right">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-[#1E3A8A]"
                  onClick={() => toggleSort('amountCr')}
                >
                  Amount {sortGlyph('amountCr', sortKey, sortDir)}
                </button>
              </th>
              <th className="px-3 py-3 text-right">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-[#1E3A8A]"
                  onClick={() => toggleSort('sharePct')}
                >
                  Share {sortGlyph('sharePct', sortKey, sortDir)}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredSorted.map((r, i) => (
              <tr
                key={`${r.name}-${i}`}
                className={`cursor-pointer transition hover:bg-slate-50 ${
                  r.riskHighlight ? 'bg-amber-50/50' : ''
                }`}
                onClick={() => onRowClick(r)}
              >
                <td className="px-3 py-2.5 font-medium text-slate-900">{r.name}</td>
                <td className="px-3 py-2.5 text-slate-600">{r.segment}</td>
                <td className="px-3 py-2.5 tabular-nums text-slate-800">{r.riskRating ?? '—'}</td>
                <td className="px-3 py-2.5 text-slate-600">{r.maturityBucket ?? '—'}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-900">
                  {formatInrCr(r.amountCr)}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                  {r.sharePct.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredSorted.some((r) => r.riskHighlight) ? (
        <p className="mt-2 text-[10px] text-amber-800">
          Highlighted rows: elevated concentration / rating watch (illustrative).
        </p>
      ) : null}
    </div>
  )
}
