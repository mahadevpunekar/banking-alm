import { useCallback, useMemo, useState } from 'react'
import { Landmark, Scale, TrendingUp, Wallet } from 'lucide-react'
import { fetchDashboard } from '@/api/dashboardService'
import type { DashboardAlert, DrillBreakdownRow, ExposureRow, KpiExtension } from '@/api/types'
import { AlertPanel } from '@/components/dashboard/AlertPanel'
import type { DashboardEntity, DashboardScenario } from '@/components/dashboard/DashboardControlBar'
import { DashboardControlBar } from '@/components/dashboard/DashboardControlBar'
import { DashboardMetaStrip } from '@/components/dashboard/DashboardMetaStrip'
import { DrillDownPanel } from '@/components/dashboard/DrillDownPanel'
import { KpiCardEnterprise } from '@/components/dashboard/KpiCardEnterprise'
import { LimitsVsActualTable } from '@/components/dashboard/LimitsVsActualTable'
import { TopExposuresTable } from '@/components/dashboard/TopExposuresTable'
import { LiquidityGapBarChart } from '@/components/charts/LiquidityGapBarChart'
import { RateSensitivityLineChart } from '@/components/charts/RateSensitivityLineChart'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAsyncResource } from '@/hooks/useAsyncResource'
import { formatInrCr, formatPct } from '@/lib/format'

const defaultKpiExt: KpiExtension = {
  trendPct: 0,
  trendDirection: 'up',
  sparkline: [0, 0, 0, 0, 0, 0, 0],
  health: 'good',
}

function scenarioChartLabel(s: DashboardScenario): string {
  switch (s) {
    case 'Base':
      return 'Base'
    case '+100 bps':
      return '+100 bps parallel'
    case '+200 bps':
      return '+200 bps parallel'
    case 'Stress':
      return 'Regulatory stress'
    default:
      return s
  }
}

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useAsyncResource(fetchDashboard, [])
  const [asOfDate, setAsOfDate] = useState('2026-03-31')
  const [scenario, setScenario] = useState<DashboardScenario>('Base')
  const [entity, setEntity] = useState<DashboardEntity>('Bank')
  const [drill, setDrill] = useState<{
    open: boolean
    title: string
    subtitle?: string
    rows: DrillBreakdownRow[]
  }>({ open: false, title: '', rows: [] })

  const openDrill = useCallback((title: string, subtitle: string | undefined, rows: DrillBreakdownRow[]) => {
    setDrill({ open: true, title, subtitle, rows })
  }, [])

  const closeDrill = useCallback(() => {
    setDrill((d) => ({ ...d, open: false }))
  }, [])

  const onMockAction = useCallback((label: string) => {
    window.alert(`${label} — mock action. Connect to orchestration / reporting service.`)
  }, [])

  const handleAlertClick = useCallback(
    (a: DashboardAlert) => {
      openDrill(`Alert: ${a.id}`, a.message, data?.drillDownSample ?? [])
    },
    [data?.drillDownSample, openDrill],
  )

  const kpis = data?.kpis
  const kpiExt = data?.kpiExtensions ?? {}

  const extAssets = kpiExt.assets ?? defaultKpiExt
  const extLiab = kpiExt.liabilities ?? defaultKpiExt
  const extLiq = kpiExt.liquidityGap ?? defaultKpiExt
  const extNii = kpiExt.nii ?? defaultKpiExt

  const drillRows = useMemo(() => data?.drillDownSample ?? [], [data?.drillDownSample])

  if (isLoading && !data) return <LoadingState label="Loading dashboard…" />
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />
  if (!data || !kpis) return null

  return (
    <div className="relative pb-8">
      <PageHeader
        title="Dashboard"
        subtitle={`Main ALM overview as of ${kpis.asOfDate}. Figures in INR crore unless noted.`}
      />

      <DashboardControlBar
        asOfDate={asOfDate}
        onAsOfDateChange={setAsOfDate}
        scenario={scenario}
        onScenarioChange={setScenario}
        entity={entity}
        onEntityChange={setEntity}
        onRunStress={() => onMockAction('Run stress test')}
        onGenerateAlcoPack={() => onMockAction('Generate ALCO pack')}
        quickActions={{
          onRunScenario: () => onMockAction('Run scenario'),
          onExport: () => onMockAction('Export report'),
          onDownloadSls: () => onMockAction('Download SLS'),
          onShareAlco: () => onMockAction('Share ALCO pack'),
        }}
      />

      <DashboardMetaStrip meta={data.meta} />

      {error ? (
        <div className="mb-4">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : null}

      <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCardEnterprise
              label="Total assets"
              value={formatInrCr(kpis.totalAssetsCr)}
              hint="On-balance sheet, consolidated"
              icon={<Landmark className="h-4 w-4" />}
              ext={extAssets}
              onClick={() =>
                openDrill('Total assets — breakdown', `${entity} · as of ${asOfDate}`, drillRows)
              }
            />
            <KpiCardEnterprise
              label="Total liabilities"
              value={formatInrCr(kpis.totalLiabilitiesCr)}
              hint="Deposits & borrowings"
              icon={<Scale className="h-4 w-4" />}
              ext={extLiab}
              onClick={() =>
                openDrill('Total liabilities — breakdown', `${entity} · as of ${asOfDate}`, drillRows)
              }
            />
            <KpiCardEnterprise
              label="Liquidity gap (structural)"
              value={formatInrCr(kpis.liquidityGapCr)}
              hint="Contractual net gap — current run"
              icon={<Wallet className="h-4 w-4" />}
              ext={extLiq}
              onClick={() =>
                openDrill(
                  'Liquidity gap — breakdown',
                  `Scenario: ${scenario} · ${entity}`,
                  drillRows,
                )
              }
            />
            <KpiCardEnterprise
              label="Net interest income (NII)"
              value={formatInrCr(kpis.niiCr)}
              hint={`YoY ${formatPct(kpis.niiChangePctYoY)} (illustrative)`}
              icon={<TrendingUp className="h-4 w-4" />}
              ext={extNii}
              onClick={() =>
                openDrill('NII — drivers', `Trailing view · ${entity}`, drillRows)
              }
            />
          </div>

          <LimitsVsActualTable rows={data.limitsVsActual} />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card
              title="Liquidity gap by time bucket"
              description="Structural mismatch (assets − liabilities) per bucket."
            >
              {isLoading ? (
                <div className="h-[320px] animate-pulse rounded-md bg-slate-100" />
              ) : (
                <LiquidityGapBarChart
                  data={data.liquidityGapByBucket}
                  onBarClick={(bucket, cumulativeCr) =>
                    openDrill(
                      `Liquidity — ${bucket}`,
                      `Cumulative gap to bucket: ${formatInrCr(cumulativeCr)}`,
                      drillRows,
                    )
                  }
                />
              )}
            </Card>
            <Card
              title="Interest rate sensitivity"
              description="EVE and NII deltas vs tenor (illustrative parallel shock)."
            >
              {isLoading ? (
                <div className="h-[320px] animate-pulse rounded-md bg-slate-100" />
              ) : (
                <RateSensitivityLineChart
                  data={data.rateSensitivity}
                  scenarioLabel={scenarioChartLabel(scenario)}
                  onPointClick={(tenor) =>
                    openDrill(
                      `IRRBB — ${tenor}`,
                      `${scenarioChartLabel(scenario)} · ${entity}`,
                      drillRows,
                    )
                  }
                />
              )}
            </Card>
          </div>

          <Card title="Top exposures" description="By notional — sort, filter, and drill into rows.">
            {isLoading ? (
              <div className="h-40 animate-pulse rounded-md bg-slate-100" />
            ) : (
              <TopExposuresTable
                data={data.topExposures}
                onRowClick={(r: ExposureRow) =>
                  openDrill(`Exposure — ${r.name}`, `${r.segment} · ${r.riskRating ?? '—'}`, drillRows)
                }
              />
            )}
          </Card>
        </div>

        <div className="min-w-0 xl:sticky xl:top-4 xl:self-start">
          <AlertPanel alerts={data.alerts} onAlertClick={handleAlertClick} />
        </div>
      </div>

      <DrillDownPanel
        open={drill.open}
        title={drill.title}
        subtitle={drill.subtitle}
        rows={drill.rows}
        onClose={closeDrill}
      />

    </div>
  )
}
