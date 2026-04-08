import { almClient } from './client'
import { apiUsesMock } from './env'
import { sleep } from './sleep'
import type { LiquidityResponse } from './types'
import { liquidityMock } from '@/mocks/liquidity.mock'

export async function fetchLiquidity(signal?: AbortSignal): Promise<LiquidityResponse> {
  if (apiUsesMock()) {
    await sleep(420, signal)
    return structuredClone(liquidityMock)
  }
  const { data } = await almClient.get<LiquidityResponse>('/api/liquidity', { signal })
  return data
}
