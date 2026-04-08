import { useMemo } from 'react'
import type { LiquidityHeatmapCell } from '@/api/types'

type Props = {
  cells: LiquidityHeatmapCell[]
  categories: string[]
}

function cellStyle(mismatchPct: number): { className: string; label: string } {
  const t = Math.max(-1, Math.min(1, mismatchPct))
  let cls = 'border border-slate-200 '
  if (t > 0.25) cls += 'bg-blue-200 text-blue-950'
  else if (t > 0.1) cls += 'bg-blue-100 text-blue-900'
  else if (t > 0) cls += 'bg-slate-100 text-slate-800'
  else if (t > -0.1) cls += 'bg-white text-slate-700'
  else if (t > -0.25) cls += 'bg-amber-50 text-amber-900'
  else cls += 'bg-amber-200 text-amber-950'
  return { className: cls, label: `${(t * 100).toFixed(0)}%` }
}

export function LiquidityHeatmap({ cells, categories }: Props) {
  const { buckets, matrix } = useMemo(() => {
    const bucketSet = [...new Set(cells.map((c) => c.bucket))]
    const map = new Map<string, Map<string, number>>()
    for (const c of cells) {
      if (!map.has(c.bucket)) map.set(c.bucket, new Map())
      map.get(c.bucket)!.set(c.category, c.mismatchPct)
    }
    return { buckets: bucketSet, matrix: map }
  }, [cells])

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-slate-50 px-2 py-2 text-left font-semibold text-slate-700">
              Bucket
            </th>
            {categories.map((cat) => (
              <th
                key={cat}
                className="px-2 py-2 text-center font-semibold text-slate-600"
              >
                {cat}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buckets.map((bucket) => (
            <tr key={bucket}>
              <td className="sticky left-0 z-10 border-t border-slate-200 bg-white px-2 py-1.5 font-medium text-slate-800">
                {bucket}
              </td>
              {categories.map((cat) => {
                const v = matrix.get(bucket)?.get(cat) ?? 0
                const { className, label } = cellStyle(v)
                return (
                  <td key={cat} className={`p-0.5`}>
                    <div
                      className={`rounded px-2 py-2 text-center font-medium tabular-nums ${className}`}
                      title={`Mismatch vs structural neutral: ${(v * 100).toFixed(1)}%`}
                    >
                      {label}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-slate-500">
        Cell shading indicates directional mismatch intensity (behavioural vs contractual). Darker amber =
        larger negative gap concentration.
      </p>
    </div>
  )
}
