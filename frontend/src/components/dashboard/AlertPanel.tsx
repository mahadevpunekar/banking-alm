import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { DashboardAlert } from '@/api/types'
import { Card } from '@/components/ui/Card'

type Props = {
  alerts: DashboardAlert[]
  onAlertClick: (alert: DashboardAlert) => void
}

function severityStyles(sev: DashboardAlert['severity']) {
  switch (sev) {
    case 'critical':
      return {
        border: 'border-l-4 border-[#DC2626] bg-red-50/80',
        icon: <AlertTriangle className="h-4 w-4 text-[#DC2626]" aria-hidden />,
        label: 'Critical',
        labelCls: 'text-[#DC2626]',
      }
    case 'warning':
      return {
        border: 'border-l-4 border-amber-500 bg-amber-50/70',
        icon: <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden />,
        label: 'Warning',
        labelCls: 'text-amber-800',
      }
    default:
      return {
        border: 'border-l-4 border-[#16A34A] bg-emerald-50/60',
        icon: <CheckCircle2 className="h-4 w-4 text-[#16A34A]" aria-hidden />,
        label: 'Normal',
        labelCls: 'text-emerald-800',
      }
  }
}

export function AlertPanel({ alerts, onAlertClick }: Props) {
  return (
    <Card title="Alerts & breaches" description="Click an item for drill-down (mock)." padding="sm">
      <ul className="space-y-2">
        {alerts.map((a) => {
          const s = severityStyles(a.severity)
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onAlertClick(a)}
                className={`flex w-full gap-2 rounded-md p-3 text-left transition hover:opacity-95 ${s.border}`}
              >
                <span className="mt-0.5 shrink-0">{s.icon}</span>
                <span className="min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${s.labelCls}`}>
                    {s.label}
                  </span>
                  <p className="mt-0.5 text-xs font-medium leading-snug text-slate-900">{a.message}</p>
                  {a.detail ? (
                    <p className="mt-1 flex items-start gap-1 text-[10px] text-slate-600">
                      <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                      {a.detail}
                    </p>
                  ) : null}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
