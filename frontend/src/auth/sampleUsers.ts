import type { UserRole } from '@/api/types'

export type SampleUser = {
  username: string
  password: string
  displayName: string
  role: UserRole
  title: string
}

/** Demo-only accounts — replace with NestJS / OAuth2 in production. */
export const SAMPLE_USERS: SampleUser[] = [
  {
    username: 'cfo.mehta',
    password: 'Demo@2026',
    displayName: 'Arun Mehta',
    role: 'CFO',
    title: 'Chief Financial Officer',
  },
  {
    username: 'risk.iyer',
    password: 'Demo@2026',
    displayName: 'Sunita Iyer',
    role: 'RISK_MANAGER',
    title: 'Chief Risk Officer',
  },
  {
    username: 'treasury.kapoor',
    password: 'Demo@2026',
    displayName: 'Rahul Kapoor',
    role: 'TREASURY_ALCO',
    title: 'Head of Treasury & ALCO',
  },
]

export function findSampleUser(username: string, password: string): SampleUser | undefined {
  const u = SAMPLE_USERS.find(
    (s) => s.username.toLowerCase() === username.trim().toLowerCase() && s.password === password,
  )
  return u
}
