import { fetchLiquidity } from '@/api/liquidityService'
import type { LiquidityBucketRow } from '@/api/types'
import { CumulativeGapAreaChart } from '@/components/charts/CumulativeGapAreaChart'
import { LiquidityHeatmap } from '@/components/charts/LiquidityHeatmap'
import { Card } from '@/components/ui/Card'
import type { Column } from '@/components/ui/DataTable'
import { DataTable } from '@/components/ui/DataTable'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAsyncResource } from '@/hooks/useAsyncResource'
import { formatInrCr } from '@/lib/format'

const columns: Column<LiquidityBucketRow>[] = [
  { key: 'bucket', header: 'Time bucket', accessor: (r) => r.bucket },
  {
    key: 'inflowsCr',
    header: 'Inflows',
    align: 'right',
    accessor: (r) => formatInrCr(r.inflowsCr),
  },
  {
    key: 'outflowsCr',
    header: 'Outflows',
    align: 'right',
    accessor: (r) => formatInrCr(r.outflowsCr),
  },
  {
    key: 'netGapCr',
    header: 'Net gap',
    align: 'right',
    accessor: (r) => (
      <span className={r.netGapCr < 0 ? 'text-amber-800' : 'text-slate-900'}>
        {formatInrCr(r.netGapCr)}
      </span>
    ),
  },
  {
    key: 'cumulativeGapCr',
    header: 'Cumulative gap',
    align: 'right',
    accessor: (r) => (
      <span className="font-medium tabular-nums">{formatInrCr(r.cumulativeGapCr)}</span>
    ),
  },
  {
    key: 'limitCr',
    header: 'Limit',
    align: 'right',
    accessor: (r) => (r.limitCr != null ? formatInrCr(r.limitCr) : '—'),
  },
]

export function LiquidityRiskPage() {
  const { data, isLoading, error, refetch } = useAsyncResource(fetchLiquidity, [])

  if (isLoading && !data) return <LoadingState label="Loading liquidity…" />
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />
  if (!data) return null

  return (
    <div>
      <PageHeader
        title="Liquidity risk"
        subtitle={`Structural liquidity and mismatch analysis as of ${data.asOfDate}. Overnight through 5+ years.`}
      />
      {error ? (
        <div className="mb-4">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : null}

      <div className="mb-6 grid gap-6 lg:grid-cols-5">
        <Card
          className="lg:col-span-3"
          title="Cumulative liquidity gap"
          description="Running sum of contractual net gaps by bucket."
          padding="none"
        >
          <div className="p-5 pt-0">
            <CumulativeGapAreaChart data={data.buckets} />
          </div>
        </Card>
        <Card
          className="lg:col-span-2"
          title="Mismatch heatmap"
          description="Behavioural vs structural mismatch intensity by bucket and funding category."
          padding="none"
        >
          <div className="p-4">
            <LiquidityHeatmap cells={data.heatmap} categories={data.heatmapCategories} />
          </div>
        </Card>
      </div>

      <Card title="Time bucket table" description="Overnight → 5+ years. Limits shown where defined.">
        <DataTable columns={columns} data={data.buckets} rowKey={(r) => r.bucket} />
      </Card>
    </div>
  )
}
