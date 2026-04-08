import { ChevronDown, Download, FileText, MoreHorizontal, Send, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export type QuickActionHandlers = {
  onRunScenario: () => void
  onExport: () => void
  onDownloadSls: () => void
  onShareAlco: () => void
}

type Props = QuickActionHandlers

/**
 * In-ribbon “Quick actions” menu. Intended workflows (wire to backend later):
 * - Run scenario: re-price book / refresh KPIs for selected scenario & as-of date
 * - Export report: PDF/XLS regulatory or management pack for current view
 * - Download SLS: Statement of Liquidity / LCR-style submission extract
 * - Share ALCO pack: email or workspace handoff for ALCO meeting materials
 */
export function DashboardQuickActionsMenu({
  onRunScenario,
  onExport,
  onDownloadSls,
  onShareAlco,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const run = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  const item =
    'flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-slate-800 hover:bg-slate-50'

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
      >
        <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" aria-hidden />
        Quick actions
        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div
          className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="menu"
          aria-label="Quick actions"
        >
          <button type="button" role="menuitem" className={item} onClick={() => run(onRunScenario)}>
            <Zap className="h-4 w-4 shrink-0 text-[#1E3A8A]" aria-hidden />
            Run scenario
          </button>
          <button type="button" role="menuitem" className={item} onClick={() => run(onExport)}>
            <FileText className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
            Export report
          </button>
          <button type="button" role="menuitem" className={item} onClick={() => run(onDownloadSls)}>
            <Download className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden />
            Download SLS
          </button>
          <button type="button" role="menuitem" className={item} onClick={() => run(onShareAlco)}>
            <Send className="h-4 w-4 shrink-0 text-slate-600" aria-hidden />
            Share ALCO pack
          </button>
        </div>
      ) : null}
    </div>
  )
}
