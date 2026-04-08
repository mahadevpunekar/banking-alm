import type { UserRole } from '@/api/types'
import type { SampleUser } from '@/auth/sampleUsers'

export type AuthUser = {
  username: string
  displayName: string
  role: UserRole
  title: string
}

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => { ok: true } | { ok: false; message: string }
  logout: () => void
  sampleUsers: SampleUser[]
}
