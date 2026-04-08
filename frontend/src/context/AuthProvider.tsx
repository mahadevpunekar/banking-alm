import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from '@/auth/AuthContext'
import { findSampleUser, SAMPLE_USERS } from '@/auth/sampleUsers'
import type { AuthContextValue, AuthUser } from '@/auth/types'

const SESSION_KEY = 'alm_session_v1'

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AuthUser>
    if (!parsed.username || !parsed.displayName || !parsed.role) return null
    const stillValid = SAMPLE_USERS.some((s) => s.username === parsed.username)
    if (!stillValid) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return {
      username: parsed.username,
      displayName: parsed.displayName,
      role: parsed.role,
      title: parsed.title ?? '',
    }
  } catch {
    return null
  }
}

function writeSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession())

  const login = useCallback((username: string, password: string) => {
    const found = findSampleUser(username, password)
    if (!found) {
      return { ok: false as const, message: 'Invalid username or password.' }
    }
    const next: AuthUser = {
      username: found.username,
      displayName: found.displayName,
      role: found.role,
      title: found.title,
    }
    writeSession(next)
    setUser(next)
    localStorage.setItem('alm_user_role', found.role)
    return { ok: true as const }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    localStorage.removeItem('alm_user_role')
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      login,
      logout,
      sampleUsers: SAMPLE_USERS,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
