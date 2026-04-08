import { fetchIrrbb } from '@/api/irrbbService'
import type { EVEImpactPoint, RepricingRow } from '@/api/types'
import { EVEImpactBarChart } from '@/components/charts/EVEImpactBarChart'
import { NIIBarChart } from '@/components/charts/NIIBarChart'
import { RepricingGapBarChart } from '@/components/charts/RepricingGapBarChart'
import { Card } from '@/components/ui/Card'
import type { Column } from '@/components/ui/DataTable'
import { DataTable } from '@/components/ui/DataTable'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAsyncResource } from '@/hooks/useAsyncResource'
import { formatInrCr, formatPct } from '@/lib/format'

const repricingColumns: Column<RepricingRow>[] = [
  { key: 'bucket', header: 'Repricing bucket', accessor: (r) => r.bucket },
  {
    key: 'rsa',
    header: 'RSA',
    align: 'right',
    accessor: (r) => formatInrCr(r.rateSensitiveAssetsCr),
  },
  {
    key: 'rsl',
    header: 'RSL',
    align: 'right',
    accessor: (r) => formatInrCr(r.rateSensitiveLiabilitiesCr),
  },
  {
    key: 'repricingGapCr',
    header: 'Gap',
    align: 'right',
    accessor: (r) => (
      <span className={r.repricingGapCr < 0 ? 'text-amber-800' : ''}>
        {formatInrCr(r.repricingGapCr)}
      </span>
    ),
  },
]

const eveColumns: Column<EVEImpactPoint>[] = [
  { key: 'shockLabel', header: 'Shock', accessor: (r) => r.shockLabel },
  {
    key: 'eveCr',
    header: 'EVE',
    align: 'right',
    accessor: (r) => formatInrCr(r.eveCr),
  },
  {
    key: 'changeFromBasePct',
    header: 'Δ vs base',
    align: 'right',
    accessor: (r) => formatPct(r.changeFromBasePct),
  },
]

export function IrrbbPage() {
  const { data, isLoading, error, refetch } = useAsyncResource(fetchIrrbb, [])

  if (isLoading && !data) return <LoadingState label="Loading IRRBB…" />
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />
  if (!data) return null

  return (
    <div>
      <PageHeader
        title="Interest rate risk (IRRBB)"
        subtitle={`Repricing gaps, NII simulation, and EVE under standard shocks. As of ${data.asOfDate}.`}
      />
      {error ? (
        <div className="mb-4">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : null}

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card
          title="Repricing profile"
          description="Rate-sensitive assets and liabilities by repricing bucket."
        >
          <RepricingGapBarChart data={data.repricing} />
        </Card>
        <Card title="NII simulation" description="Base and parallel rate scenarios (illustrative).">
          <NIIBarChart data={data.niiSimulation} />
        </Card>
      </div>

      <div className="mb-6">
        <Card title="EVE impact" description="Economic value of equity under rate shocks.">
          <EVEImpactBarChart data={data.eveImpact} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Repricing gap table">
          <DataTable columns={repricingColumns} data={data.repricing} rowKey={(r) => r.bucket} />
        </Card>
        <Card title="EVE summary table">
          <DataTable columns={eveColumns} data={data.eveImpact} rowKey={(r) => r.shockLabel} dense />
        </Card>
      </div>
    </div>
  )
}
