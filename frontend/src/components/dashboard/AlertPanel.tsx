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
        wrap: 'border border-red-200/90 bg-white',
        bar: 'bg-[#dc2626]',
        icon: <AlertTriangle className="h-4 w-4 text-[#b91c1c]" aria-hidden />,
        label: 'Critical',
        labelCls: 'text-[#b91c1c]',
      }
    case 'warning':
      return {
        wrap: 'border border-amber-200/90 bg-white',
        bar: 'bg-amber-500',
        icon: <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden />,
        label: 'Warning',
        labelCls: 'text-amber-900',
      }
    default:
      return {
        wrap: 'border border-emerald-200/80 bg-white',
        bar: 'bg-[#16a34a]',
        icon: <CheckCircle2 className="h-4 w-4 text-[#15803d]" aria-hidden />,
        label: 'Normal',
        labelCls: 'text-emerald-900',
      }
  }
}

export function AlertPanel({ alerts, onAlertClick }: Props) {
  return (
    <Card title="Alerts & breaches" description="Select an item for drill-down (mock)." padding="sm">
      <ul className="space-y-2">
        {alerts.map((a) => {
          const s = severityStyles(a.severity)
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onAlertClick(a)}
                className={`flex w-full gap-0 overflow-hidden rounded-sm text-left shadow-[0_1px_2px_rgba(12,25,41,0.04)] transition-shadow hover:shadow-[0_2px_6px_rgba(12,25,41,0.07)] ${s.wrap}`}
              >
                <span className={`w-1 shrink-0 self-stretch ${s.bar}`} aria-hidden />
                <span className="flex flex-1 gap-2.5 p-3">
                  <span className="mt-0.5 shrink-0">{s.icon}</span>
                  <span className="min-w-0">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${s.labelCls}`}>
                      {s.label}
                    </span>
                    <p className="mt-1 text-xs font-medium leading-snug text-[var(--color-alm-heading)]">
                      {a.message}
                    </p>
                    {a.detail ? (
                      <p className="mt-1.5 flex items-start gap-1 text-[10px] leading-relaxed text-slate-600">
                        <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" aria-hidden />
                        {a.detail}
                      </p>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
