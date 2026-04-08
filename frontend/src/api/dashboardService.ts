import { almClient } from './client'
import { apiUsesMock } from './env'
import { sleep } from './sleep'
import type { DashboardResponse } from './types'
import { dashboardMock } from '@/mocks/dashboard.mock'

export async function fetchDashboard(signal?: AbortSignal): Promise<DashboardResponse> {
  if (apiUsesMock()) {
    await sleep(380, signal)
    return structuredClone(dashboardMock)
  }
  const { data } = await almClient.get<DashboardResponse>('/api/dashboard', { signal })
  return data
}
