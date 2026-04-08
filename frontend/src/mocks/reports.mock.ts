import type { ReportsResponse } from '@/api/types'

export const reportsMock: ReportsResponse = {
  reports: [
    {
      id: 'sls',
      code: 'SLS',
      name: 'Structural Liquidity Statement',
      description: 'Bucket-wise liquidity position and cumulative gaps for regulatory submission.',
      lastGenerated: '2026-04-05T09:15:00Z',
    },
    {
      id: 'irss',
      code: 'IRSS',
      name: 'Interest Rate Sensitivity Statement',
      description: 'Repricing gaps and sensitivity of earnings and EVE to interest rate movements.',
      lastGenerated: '2026-04-05T09:18:00Z',
    },
    {
      id: 'dlr',
      code: 'DLR',
      name: 'Dynamic Liquidity Report',
      description: 'Forward-looking liquidity profile under base and stressed assumptions.',
      lastGenerated: '2026-04-04T16:40:00Z',
    },
    {
      id: 'alco_pack',
      code: 'ALCO',
      name: 'ALCO pack — consolidated',
      description: 'Summary dashboards for ALCO: liquidity, IRRBB, and capital linkage.',
      lastGenerated: '2026-04-01T11:00:00Z',
    },
  ],
}
