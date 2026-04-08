import { Bell, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'

const ROLE_LABELS: Record<string, string> = {
  CFO: 'CFO',
  RISK_MANAGER: 'Risk manager',
  TREASURY_ALCO: 'Treasury / ALCO',
}

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : ''

  return (
    <header className="relative flex h-[3.25rem] shrink-0 items-center justify-between gap-4 border-b border-slate-300/80 bg-white px-4 shadow-[0_1px_0_rgba(12,25,41,0.04)] sm:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0c1929] via-[#1e3a8a] to-sky-700"
        aria-hidden
      />
      <div className="relative flex min-w-0 flex-1 items-center pt-0.5">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Institution view
          </p>
          <p className="truncate text-sm font-semibold text-[var(--color-alm-heading)]">
            Consolidated banking book
          </p>
        </div>
      </div>
      <div className="relative flex items-center gap-1.5 sm:gap-2.5">
        {user ? (
          <span className="hidden rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:inline">
            {roleLabel}
          </span>
        ) : null}
        <button
          type="button"
          className="relative rounded-sm p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-[1.15rem] w-[1.15rem]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#1e3a8a] ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50/80 py-1 pl-1 pr-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-slate-500 ring-1 ring-slate-200/90">
            <User className="h-4 w-4" aria-hidden />
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-semibold text-[var(--color-alm-heading)]">
              {user?.displayName ?? '—'}
            </p>
            <p className="truncate text-[10px] text-slate-500">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="alm-btn-secondary !px-2.5 sm:!px-3"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
