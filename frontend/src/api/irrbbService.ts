import { almClient } from './client'
import { apiUsesMock } from './env'
import { sleep } from './sleep'
import type { IrrbbResponse } from './types'
import { irrbbMock } from '@/mocks/irrbb.mock'

export async function fetchIrrbb(signal?: AbortSignal): Promise<IrrbbResponse> {
  if (apiUsesMock()) {
    await sleep(400, signal)
    return structuredClone(irrbbMock)
  }
  const { data } = await almClient.get<IrrbbResponse>('/api/irrbb', { signal })
  return data
}
