import { almClient } from './client'
import { apiUsesMock } from './env'
import { sleep } from './sleep'
import type { StressResponse } from './types'
import { stressMock } from '@/mocks/stress.mock'

export async function fetchStress(signal?: AbortSignal): Promise<StressResponse> {
  if (apiUsesMock()) {
    await sleep(360, signal)
    return structuredClone(stressMock)
  }
  const { data } = await almClient.get<StressResponse>('/api/stress', { signal })
  return data
}
