import { almClient } from './client'
import { apiUsesMock } from './env'
import { sleep } from './sleep'
import type { ReportsResponse } from './types'
import { reportsMock } from '@/mocks/reports.mock'

export async function fetchReports(signal?: AbortSignal): Promise<ReportsResponse> {
  if (apiUsesMock()) {
    await sleep(280, signal)
    return structuredClone(reportsMock)
  }
  const { data } = await almClient.get<ReportsResponse>('/api/reports', { signal })
  return data
}
