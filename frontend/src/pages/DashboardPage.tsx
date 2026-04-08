import { Landmark, Scale, TrendingUp, Wallet } from 'lucide-react'
import { fetchDashboard } from '@/api/dashboardService'
import { useAsyncResource } from '@/hooks/useAsyncResource'
import { formatInrCr, formatPct } from '@/lib/format'
import { LiquidityGapBarChart } from '@/components/charts/LiquidityGapBarChart'
import { RateSensitivityLineChart } from '@/components/charts/RateSensitivityLineChart'
import { Card } from '@/components/ui/Card'
import type { Column } from '@/components/ui/DataTable'
import { DataTable } from '@/components/ui/DataTable'
import { ErrorState } from '@/components/ui/ErrorState'
import { KpiCard } from '@/components/ui/KpiCard'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import type { ExposureRow } from '@/api/types'

const exposureColumns: Column<ExposureRow>[] = [
  { key: 'name', header: 'Exposure', accessor: (r) => r.name },
  { key: 'segment', header: 'Segment', accessor: (r) => r.segment },
  {
    key: 'amountCr',
    header: 'Amount',
    align: 'right',
    accessor: (r) => formatInrCr(r.amountCr),
  },
  {
    key: 'sharePct',
    header: 'Share',
    align: 'right',
    accessor: (r) => `${r.sharePct.toFixed(1)}%`,
  },
]

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useAsyncResource(fetchDashboard, [])

  if (isLoading && !data) return <LoadingState label="Loading dashboard…" />
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />
  if (!data) return null

  const { kpis } = data

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Main ALM overview as of ${kpis.asOfDate}. Figures in INR crore unless noted.`}
      />

      {error ? (
        <div className="mb-4">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total assets"
          value={formatInrCr(kpis.totalAssetsCr)}
          hint="On-balance sheet, consolidated"
          icon={<Landmark className="h-4 w-4" />}
        />
        <KpiCard
          label="Total liabilities"
          value={formatInrCr(kpis.totalLiabilitiesCr)}
          hint="Deposits & borrowings"
          icon={<Scale className="h-4 w-4" />}
        />
        <KpiCard
          label="Liquidity gap (structural)"
          value={formatInrCr(kpis.liquidityGapCr)}
          hint="Contractual net gap — current run"
          trend={{
            value: kpis.liquidityGapCr < 0 ? 'Short in near buckets' : 'Long in structural view',
            positive: kpis.liquidityGapCr >= 0,
          }}
          icon={<Wallet className="h-4 w-4" />}
        />
        <KpiCard
          label="Net interest income (NII)"
          value={formatInrCr(kpis.niiCr)}
          hint="Trailing 12 months (illustrative)"
          trend={{
            value: `YoY ${formatPct(kpis.niiChangePctYoY)}`,
            positive: kpis.niiChangePctYoY >= 0,
          }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Liquidity gap by time bucket"
          description="Structural mismatch (assets − liabilities) per bucket."
        >
          {isLoading ? (
            <div className="h-[320px] animate-pulse rounded-md bg-slate-100" />
          ) : (
            <LiquidityGapBarChart data={data.liquidityGapByBucket} />
          )}
        </Card>
        <Card
          title="Interest rate sensitivity"
          description="Illustrative EVE and NII deltas vs tenor (parallel shock view)."
        >
          {isLoading ? (
            <div className="h-[320px] animate-pulse rounded-md bg-slate-100" />
          ) : (
            <RateSensitivityLineChart data={data.rateSensitivity} />
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Top exposures" description="By notional — credit, funding, and investments.">
          {isLoading ? (
            <div className="h-40 animate-pulse rounded-md bg-slate-100" />
          ) : (
            <DataTable
              columns={exposureColumns}
              data={data.topExposures}
              rowKey={(r, i) => `${r.name}-${i}`}
            />
          )}
        </Card>
      </div>
    </div>
  )
}
