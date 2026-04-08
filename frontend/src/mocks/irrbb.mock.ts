import type { IrrbbResponse } from '@/api/types'

export const irrbbMock: IrrbbResponse = {
  asOfDate: '2026-03-31',
  repricing: [
    { bucket: '≤ 1M', rateSensitiveAssetsCr: 48_200, rateSensitiveLiabilitiesCr: 52_100, repricingGapCr: -3_900 },
    { bucket: '1–3M', rateSensitiveAssetsCr: 32_400, rateSensitiveLiabilitiesCr: 28_900, repricingGapCr: 3_500 },
    { bucket: '3–6M', rateSensitiveAssetsCr: 26_800, rateSensitiveLiabilitiesCr: 24_200, repricingGapCr: 2_600 },
    { bucket: '6–12M', rateSensitiveAssetsCr: 31_500, rateSensitiveLiabilitiesCr: 29_100, repricingGapCr: 2_400 },
    { bucket: '1–3Y', rateSensitiveAssetsCr: 44_200, rateSensitiveLiabilitiesCr: 38_600, repricingGapCr: 5_600 },
    { bucket: '3–5Y', rateSensitiveAssetsCr: 28_900, rateSensitiveLiabilitiesCr: 22_400, repricingGapCr: 6_500 },
    { bucket: '5Y+', rateSensitiveAssetsCr: 19_400, rateSensitiveLiabilitiesCr: 12_800, repricingGapCr: 6_600 },
  ],
  niiSimulation: [
    { scenario: 'Base', niiCr: 3_942.6 },
    { scenario: '+100 bps', niiCr: 4_128.4 },
    { scenario: '+200 bps', niiCr: 4_301.2 },
    { scenario: '-100 bps', niiCr: 3_756.1 },
    { scenario: '-200 bps', niiCr: 3_569.8 },
    { scenario: 'Steepener', niiCr: 3_998.0 },
  ],
  eveImpact: [
    { shockLabel: '+200 bps parallel', shockBps: 200, eveCr: 11_420, changeFromBasePct: -4.8 },
    { shockLabel: '+100 bps parallel', shockBps: 100, eveCr: 11_890, changeFromBasePct: -2.5 },
    { shockLabel: 'Base', shockBps: 0, eveCr: 12_180, changeFromBasePct: 0 },
    { shockLabel: '-100 bps parallel', shockBps: -100, eveCr: 12_510, changeFromBasePct: 2.7 },
    { shockLabel: '-200 bps parallel', shockBps: -200, eveCr: 12_840, changeFromBasePct: 5.4 },
    { shockLabel: 'Short end +75', shockBps: 75, eveCr: 11_960, changeFromBasePct: -1.8 },
  ],
}
