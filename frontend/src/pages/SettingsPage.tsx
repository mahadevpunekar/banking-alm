import { Plus, Save } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

const mockUsers = [
  { name: 'A. Mehta', email: 'a.mehta@bank.in', role: 'Risk manager', status: 'Active' },
  { name: 'R. Kapoor', email: 'r.kapoor@bank.in', role: 'Treasury', status: 'Active' },
  { name: 'S. Iyer', email: 's.iyer@bank.in', role: 'CFO office', status: 'Invited' },
]

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="User management and rule configuration (UI only — connect to NestJS auth and rule engine)."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="User management"
          description="Directory sync and RBAC will be enforced via NestJS guards."
          action={
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md bg-blue-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Invite user
            </button>
          }
        >
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {mockUsers.map((u) => (
              <li key={u.email} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">{u.role}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      u.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Rule configuration"
          description="JSON/YAML-driven rules initially; Drools migration path supported."
          action={
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Save className="h-3.5 w-3.5" />
              Save draft
            </button>
          }
        >
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-xs font-medium text-slate-600">
              Rule set name
              <input
                type="text"
                defaultValue="ALM_CORE_V1"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600">
              Behavioural prepayment — retail mortgage (β)
              <input
                type="text"
                defaultValue="0.18"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600">
              Core deposit run-off — stable (annual)
              <input
                type="text"
                defaultValue="0.05"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600">
              Rule definition (YAML preview)
              <textarea
                rows={8}
                spellCheck={false}
                defaultValue={`liquidity:\n  bucket_granularity: RBI_STANDARD\n  behavioural_override: true\nirrbb:\n  parallel_shocks_bps: [100, 200]\n  discount_curve: OIS`}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs text-slate-800 shadow-sm"
              />
            </label>
          </form>
        </Card>
      </div>
    </div>
  )
}
