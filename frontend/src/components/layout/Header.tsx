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
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
          Institution view
        </p>
        <p className="truncate text-sm font-semibold text-slate-900">Consolidated banking book</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <span className="hidden rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:inline">
            {roleLabel}
          </span>
        ) : null}
        <button
          type="button"
          className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 py-1 pl-1 pr-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
            <User className="h-4 w-4" aria-hidden />
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-semibold text-slate-900">
              {user?.displayName ?? '—'}
            </p>
            <p className="truncate text-[10px] text-slate-500">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:px-3"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}
