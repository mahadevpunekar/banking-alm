import type { StressResponse } from '@/api/types'

export const stressMock: StressResponse = {
  scenarios: [
    {
      id: 'rate_parallel_200',
      name: 'Parallel +200 bps',
      type: 'RATE_SHOCK',
      description: 'Instant parallel upward shift of the risk-free curve by 200 bps.',
    },
    {
      id: 'rate_parallel_minus_100',
      name: 'Parallel −100 bps',
      type: 'RATE_SHOCK',
      description: 'Parallel downward shift of 100 bps across all tenors.',
    },
    {
      id: 'deposit_run_15',
      name: 'Retail TD run — 15% in 5d',
      type: 'DEPOSIT_RUN',
      description: '15% of retail term deposits withdrawn within 5 business days.',
    },
    {
      id: 'market_liquidity',
      name: 'Market liquidity stress',
      type: 'MARKET_LIQUIDITY',
      description: 'Widening credit spreads and reduced repo market depth.',
    },
  ],
  results: {
    rate_parallel_200: {
      scenarioId: 'rate_parallel_200',
      metrics: [
        { key: 'eve', label: 'Economic value of equity', before: 12_180, after: 11_420, unit: 'Cr' },
        { key: 'nii', label: 'Projected NII (12M)', before: 3_942.6, after: 4_301.2, unit: 'Cr' },
        { key: 'lcr', label: 'LCR', before: 124, after: 118, unit: 'pct' },
        { key: 'nsfr', label: 'NSFR', before: 112, after: 109, unit: 'pct' },
      ],
      series: [
        { label: 'EVE', before: 12_180, after: 11_420 },
        { label: 'NII', before: 3_942.6, after: 4_301.2 },
        { label: 'Liquidity buffer', before: 8_400, after: 7_620 },
        { label: 'HQLA', before: 42_100, after: 41_200 },
      ],
    },
    rate_parallel_minus_100: {
      scenarioId: 'rate_parallel_minus_100',
      metrics: [
        { key: 'eve', label: 'Economic value of equity', before: 12_180, after: 12_510, unit: 'Cr' },
        { key: 'nii', label: 'Projected NII (12M)', before: 3_942.6, after: 3_756.1, unit: 'Cr' },
        { key: 'lcr', label: 'LCR', before: 124, after: 126, unit: 'pct' },
        { key: 'nsfr', label: 'NSFR', before: 112, after: 113, unit: 'pct' },
      ],
      series: [
        { label: 'EVE', before: 12_180, after: 12_510 },
        { label: 'NII', before: 3_942.6, after: 3_756.1 },
        { label: 'Liquidity buffer', before: 8_400, after: 8_950 },
        { label: 'HQLA', before: 42_100, after: 42_800 },
      ],
    },
    deposit_run_15: {
      scenarioId: 'deposit_run_15',
      metrics: [
        { key: 'eve', label: 'Economic value of equity', before: 12_180, after: 12_050, unit: 'Cr' },
        { key: 'nii', label: 'Projected NII (12M)', before: 3_942.6, after: 3_880.0, unit: 'Cr' },
        { key: 'lcr', label: 'LCR', before: 124, after: 108, unit: 'pct' },
        { key: 'nsfr', label: 'NSFR', before: 112, after: 104, unit: 'pct' },
      ],
      series: [
        { label: 'EVE', before: 12_180, after: 12_050 },
        { label: 'NII', before: 3_942.6, after: 3_880 },
        { label: 'Liquidity buffer', before: 8_400, after: 6_100 },
        { label: 'HQLA', before: 42_100, after: 40_500 },
      ],
    },
    market_liquidity: {
      scenarioId: 'market_liquidity',
      metrics: [
        { key: 'eve', label: 'Economic value of equity', before: 12_180, after: 11_720, unit: 'Cr' },
        { key: 'nii', label: 'Projected NII (12M)', before: 3_942.6, after: 3_910.0, unit: 'Cr' },
        { key: 'lcr', label: 'LCR', before: 124, after: 115, unit: 'pct' },
        { key: 'nsfr', label: 'NSFR', before: 112, after: 110, unit: 'pct' },
      ],
      series: [
        { label: 'EVE', before: 12_180, after: 11_720 },
        { label: 'NII', before: 3_942.6, after: 3_910 },
        { label: 'Liquidity buffer', before: 8_400, after: 7_200 },
        { label: 'HQLA', before: 42_100, after: 41_000 },
      ],
    },
  },
}
