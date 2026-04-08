import type { ReactNode } from 'react'

export type Column<T> = {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  width?: string
  render?: (row: T) => ReactNode
  accessor?: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T, index: number) => string
  dense?: boolean
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  dense = false,
  emptyMessage = 'No data',
}: DataTableProps<T>) {
  const cellY = dense ? 'py-2' : 'py-3'
  if (data.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-slate-300/80 bg-slate-50/90 px-4 py-8 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-sm border border-slate-300/80">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300/80 bg-slate-100/95">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={`px-4 ${cellY} text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600 ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 bg-white">
          {data.map((row, i) => (
            <tr key={rowKey(row, i)} className="hover:bg-slate-50/90">
              {columns.map((col) => {
                const content = col.render
                  ? col.render(row)
                  : col.accessor
                    ? col.accessor(row)
                    : (row as Record<string, unknown>)[col.key]
                return (
                  <td
                    key={col.key}
                    className={`px-4 ${cellY} text-slate-800 ${
                      col.align === 'right' ? 'text-right tabular-nums' : col.align === 'center' ? 'text-center' : ''
                    }`}
                  >
                    {content as ReactNode}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
