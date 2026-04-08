import type { DashboardResponse } from '@/api/types'

export const dashboardMock: DashboardResponse = {
  kpis: {
    asOfDate: '2026-03-31',
    totalAssetsCr: 184_230.5,
    totalLiabilitiesCr: 171_842.3,
    liquidityGapCr: -4_128.7,
    niiCr: 3_942.6,
    niiChangePctYoY: 6.2,
  },
  liquidityGapByBucket: [
    { bucket: 'Overnight', gapCr: -12_450, assetsCr: 28_100, liabilitiesCr: 40_550 },
    { bucket: '2–7 days', gapCr: -3_200, assetsCr: 9_400, liabilitiesCr: 12_600 },
    { bucket: '8–14 days', gapCr: 1_850, assetsCr: 7_200, liabilitiesCr: 5_350 },
    { bucket: '15–30 days', gapCr: 4_100, assetsCr: 11_800, liabilitiesCr: 7_700 },
    { bucket: '1–3M', gapCr: 6_720, assetsCr: 22_400, liabilitiesCr: 15_680 },
    { bucket: '3–6M', gapCr: 5_400, assetsCr: 18_200, liabilitiesCr: 12_800 },
    { bucket: '6–12M', gapCr: 3_100, assetsCr: 14_500, liabilitiesCr: 11_400 },
    { bucket: '1–3Y', gapCr: 2_800, assetsCr: 31_200, liabilitiesCr: 28_400 },
    { bucket: '3–5Y', gapCr: 1_200, assetsCr: 19_400, liabilitiesCr: 18_200 },
    { bucket: '5Y+', gapCr: 890, assetsCr: 12_030, liabilitiesCr: 11_140 },
  ],
  rateSensitivity: [
    { tenor: 'M1', eveImpactCr: -120, niiImpactCr: 45 },
    { tenor: 'M3', eveImpactCr: -340, niiImpactCr: 112 },
    { tenor: 'M6', eveImpactCr: -580, niiImpactCr: 198 },
    { tenor: 'M9', eveImpactCr: -720, niiImpactCr: 256 },
    { tenor: 'Y1', eveImpactCr: -890, niiImpactCr: 310 },
    { tenor: 'Y2', eveImpactCr: -1_020, niiImpactCr: 355 },
    { tenor: 'Y3', eveImpactCr: -1_140, niiImpactCr: 388 },
    { tenor: 'Y5', eveImpactCr: -1_280, niiImpactCr: 402 },
  ],
  topExposures: [
    { name: 'Corporate term loans — AA & above', segment: 'Credit', amountCr: 42_180, sharePct: 22.9 },
    { name: 'Retail housing — floating', segment: 'Retail', amountCr: 38_920, sharePct: 21.1 },
    { name: 'Sovereign & SDL book', segment: 'Investments', amountCr: 29_450, sharePct: 16.0 },
    { name: 'CASA & retail TD', segment: 'Deposits', amountCr: 24_100, sharePct: 13.1 },
    { name: 'Wholesale borrowings — MTN', segment: 'Funding', amountCr: 18_760, sharePct: 10.2 },
    { name: 'Agri & SME — priority', segment: 'Credit', amountCr: 12_330, sharePct: 6.7 },
  ],
}
