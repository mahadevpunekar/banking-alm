import { Lock, LogIn, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import assimilateLogo from '@/assets/assimilate_logo.png'
import { useAuth } from '@/context/useAuth'

const ROLE_LABELS: Record<string, string> = {
  CFO: 'CFO',
  RISK_MANAGER: 'Risk manager',
  TREASURY_ALCO: 'Treasury / ALCO',
}

export function LoginPage() {
  const { login, sampleUsers, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, from, navigate])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = login(username, password)
      if (result.ok) {
        navigate(from, { replace: true })
      } else {
        setError(result.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const fillSample = (u: (typeof sampleUsers)[0]) => {
    setUsername(u.username)
    setPassword(u.password)
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-alm-bg)]">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-sm border border-slate-300/80 bg-white p-8 shadow-[0_2px_12px_rgba(12,25,41,0.06)]">
          <div className="mb-8 flex justify-center">
            <img
              src={assimilateLogo}
              alt="Assimilate"
              className="h-10 w-auto max-w-[280px] object-contain"
            />
          </div>
          <h1 className="text-center text-lg font-semibold text-[var(--color-alm-heading)]">
            Sign in to ALM Console
          </h1>
          <p className="mt-1 text-center text-sm text-slate-600">
            Asset &amp; liability management — demo environment
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            {error ? (
              <div
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {error}
              </div>
            ) : null}
            <label className="block text-xs font-medium text-slate-600">
              Username
              <div className="relative mt-1">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="alm-field w-full py-2.5 pl-10 pr-3"
                  placeholder="e.g. cfo.mehta"
                  required
                />
              </div>
            </label>
            <label className="block text-xs font-medium text-slate-600">
              Password
              <div className="relative mt-1">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="alm-field w-full py-2.5 pl-10 pr-3"
                  placeholder="••••••••"
                  required
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="alm-btn-primary !w-full !py-2.5 !text-sm disabled:cursor-not-allowed disabled:opacity-55"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="mt-8 w-full max-w-lg rounded-sm border border-slate-300/80 bg-white p-5 shadow-[0_1px_4px_rgba(12,25,41,0.05)]">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            Sample users (demo)
          </h2>
          <p className="mt-1 text-xs text-slate-500">Password for all accounts: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-800">Demo@2026</code></p>
          <ul className="mt-4 divide-y divide-slate-100">
            {sampleUsers.map((u) => (
              <li key={u.username} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{u.displayName}</p>
                  <p className="text-xs text-slate-500">
                    {u.username} · {ROLE_LABELS[u.role] ?? u.role}
                  </p>
                  <p className="text-xs text-slate-400">{u.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => fillSample(u)}
                  className="alm-btn-secondary !px-3 !py-1.5 shrink-0"
                >
                  Fill credentials
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
