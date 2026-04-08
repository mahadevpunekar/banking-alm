import { FileStack, Play, Shield } from 'lucide-react'
import type { QuickActionHandlers } from '@/components/dashboard/DashboardQuickActions'
import { DashboardQuickActionsMenu } from '@/components/dashboard/DashboardQuickActions'

export type DashboardScenario = 'Base' | '+100 bps' | '+200 bps' | 'Stress'
export type DashboardEntity = 'Bank' | 'Subsidiary'

type Props = {
  asOfDate: string
  onAsOfDateChange: (v: string) => void
  scenario: DashboardScenario
  onScenarioChange: (v: DashboardScenario) => void
  entity: DashboardEntity
  onEntityChange: (v: DashboardEntity) => void
  onRunStress: () => void
  onGenerateAlcoPack: () => void
  quickActions: QuickActionHandlers
}

const SCENARIOS: DashboardScenario[] = ['Base', '+100 bps', '+200 bps', 'Stress']

const labelCls = 'flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500'

export function DashboardControlBar({
  asOfDate,
  onAsOfDateChange,
  scenario,
  onScenarioChange,
  entity,
  onEntityChange,
  onRunStress,
  onGenerateAlcoPack,
  quickActions,
}: Props) {
  return (
    <div className="relative z-0 -mx-4 mb-5 border-b border-slate-300/80 bg-white px-4 py-4 shadow-[inset_0_-1px_0_rgba(12,25,41,0.04)] sm:-mx-7 sm:px-7">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-end gap-3 sm:gap-5">
          <label className={labelCls}>
            As of date
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => onAsOfDateChange(e.target.value)}
              className="alm-field min-h-[2.375rem]"
            />
          </label>
          <label className={labelCls}>
            Scenario
            <select
              value={scenario}
              onChange={(e) => onScenarioChange(e.target.value as DashboardScenario)}
              className="alm-field min-h-[2.375rem] min-w-[148px]"
            >
              {SCENARIOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            Entity
            <select
              value={entity}
              onChange={(e) => onEntityChange(e.target.value as DashboardEntity)}
              className="alm-field min-h-[2.375rem] min-w-[148px]"
            >
              <option value="Bank">Bank (consolidated)</option>
              <option value="Subsidiary">Subsidiary</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DashboardQuickActionsMenu {...quickActions} />
          <button type="button" onClick={onRunStress} className="alm-btn-secondary">
            <Play className="h-3.5 w-3.5" aria-hidden />
            Run stress test
          </button>
          <button type="button" onClick={onGenerateAlcoPack} className="alm-btn-primary">
            <FileStack className="h-3.5 w-3.5" aria-hidden />
            Generate ALCO pack
          </button>
        </div>
      </div>
      <p className="mx-auto mt-3 flex max-w-[1400px] items-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
        <Shield className="h-3 w-3 shrink-0 text-[#1e3a8a]" aria-hidden />
        Control selections apply to dashboard view (mock). Wire to risk engine for production runs.
      </p>
    </div>
  )
}
