/** Shared ALM API types — mirror future NestJS/Python responses. */

export type UserRole = 'CFO' | 'RISK_MANAGER' | 'TREASURY_ALCO'

export interface DashboardKpis {
  asOfDate: string
  totalAssetsCr: number
  totalLiabilitiesCr: number
  liquidityGapCr: number
  niiCr: number
  niiChangePctYoY: number
}

export interface LiquidityGapBucketPoint {
  bucket: string
  gapCr: number
  assetsCr: number
  liabilitiesCr: number
}

export interface RateSensitivityPoint {
  tenor: string
  eveImpactCr: number
  niiImpactCr: number
}

export interface ExposureRow {
  name: string
  segment: string
  amountCr: number
  sharePct: number
  riskWeight?: string
}

export interface DashboardResponse {
  kpis: DashboardKpis
  liquidityGapByBucket: LiquidityGapBucketPoint[]
  rateSensitivity: RateSensitivityPoint[]
  topExposures: ExposureRow[]
}

export interface LiquidityBucketRow {
  bucket: string
  inflowsCr: number
  outflowsCr: number
  netGapCr: number
  cumulativeGapCr: number
  limitCr: number | null
}

export interface LiquidityHeatmapCell {
  bucket: string
  category: string
  mismatchPct: number
}

export interface LiquidityResponse {
  asOfDate: string
  buckets: LiquidityBucketRow[]
  heatmap: LiquidityHeatmapCell[]
  heatmapCategories: string[]
}

export interface RepricingRow {
  bucket: string
  rateSensitiveAssetsCr: number
  rateSensitiveLiabilitiesCr: number
  repricingGapCr: number
}

export interface NIISimulationPoint {
  scenario: string
  niiCr: number
}

export interface EVEImpactPoint {
  shockLabel: string
  shockBps: number
  eveCr: number
  changeFromBasePct: number
}

export interface IrrbbResponse {
  asOfDate: string
  repricing: RepricingRow[]
  niiSimulation: NIISimulationPoint[]
  eveImpact: EVEImpactPoint[]
}

export interface StressScenario {
  id: string
  name: string
  type: 'RATE_SHOCK' | 'DEPOSIT_RUN' | 'MARKET_LIQUIDITY'
  description: string
}

export interface StressComparisonMetric {
  key: string
  label: string
  before: number
  after: number
  unit: 'Cr' | 'pct' | 'ratio'
}

export interface StressComparisonSeriesPoint {
  label: string
  before: number
  after: number
}

export interface StressScenarioResult {
  scenarioId: string
  metrics: StressComparisonMetric[]
  series: StressComparisonSeriesPoint[]
}

export interface StressResponse {
  scenarios: StressScenario[]
  results: Record<string, StressScenarioResult>
}

export interface RegulatoryReport {
  id: string
  code: string
  name: string
  description: string
  lastGenerated: string | null
}

export interface ReportsResponse {
  reports: RegulatoryReport[]
}
