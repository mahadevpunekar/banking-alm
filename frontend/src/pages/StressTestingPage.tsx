import { useMemo, useState } from 'react'
import { fetchStress } from '@/api/stressService'
import type { StressComparisonMetric } from '@/api/types'
import { StressCompareChart } from '@/components/charts/StressCompareChart'
import { Card } from '@/components/ui/Card'
import type { Column } from '@/components/ui/DataTable'
import { DataTable } from '@/components/ui/DataTable'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAsyncResource } from '@/hooks/useAsyncResource'
import { formatInrCr } from '@/lib/format'

function formatMetric(m: StressComparisonMetric, v: number): string {
  if (m.unit === 'Cr') return formatInrCr(v)
  if (m.unit === 'pct') return `${v.toFixed(0)}%`
  return v.toFixed(2)
}

export function StressTestingPage() {
  const { data, isLoading, error, refetch } = useAsyncResource(fetchStress, [])
  const [scenarioId, setScenarioId] = useState<string>('rate_parallel_200')

  const scenarios = data?.scenarios ?? []

  const activeScenarioId = useMemo(() => {
    if (!data?.scenarios.length) return scenarioId
    return data.scenarios.some((s) => s.id === scenarioId)
      ? scenarioId
      : data.scenarios[0].id
  }, [data, scenarioId])

  const result = data && activeScenarioId ? data.results[activeScenarioId] : null

  const metricColumns: Column<StressComparisonMetric>[] = useMemo(
    () => [
      { key: 'label', header: 'Metric', accessor: (r) => r.label },
      {
        key: 'before',
        header: 'Before',
        align: 'right',
        accessor: (r) => formatMetric(r, r.before),
      },
      {
        key: 'after',
        header: 'After',
        align: 'right',
        accessor: (r) => (
          <span className="font-medium text-slate-900">{formatMetric(r, r.after)}</span>
        ),
      },
      {
        key: 'delta',
        header: 'Change',
        align: 'right',
        accessor: (r) => {
          const d = r.after - r.before
          if (r.unit === 'pct') {
            const sign = d >= 0 ? '+' : ''
            return (
              <span className={d < 0 ? 'text-amber-800' : 'text-slate-700'}>
                {sign}
                {d.toFixed(0)} pp
              </span>
            )
          }
          if (r.unit === 'Cr') {
            const sign = d >= 0 ? '+' : '−'
            return (
              <span className={d < 0 ? 'text-amber-800' : 'text-slate-700'}>
                {sign}
                {formatInrCr(Math.abs(d))}
              </span>
            )
          }
          const sign = d >= 0 ? '+' : ''
          return (
            <span>
              {sign}
              {d.toFixed(2)}
            </span>
          )
        },
      },
    ],
    [],
  )

  if (isLoading && !data) return <LoadingState label="Loading stress scenarios…" />
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />
  if (!data) return null

  const scenarioMeta = scenarios.find((s) => s.id === activeScenarioId)

  return (
    <div>
      <PageHeader
        title="Stress testing"
        subtitle="Regulatory and internal scenarios. Compare key metrics before and after application."
      />
      {error ? (
        <div className="mb-4">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : null}

      <Card
        className="mb-6"
        title="Scenario"
        description="Select a scenario to refresh charts and tables (mock data)."
        action={
          <label className="flex flex-col gap-1 text-xs text-slate-600 sm:flex-row sm:items-center sm:gap-2">
            <span className="font-medium">Scenario</span>
            <select
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={activeScenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        }
      >
        {scenarioMeta ? (
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
              {scenarioMeta.type.replaceAll('_', ' ')}
            </span>
            <p className="text-slate-600">{scenarioMeta.description}</p>
          </div>
        ) : null}
      </Card>

      {result ? (
        <>
          <div className="mb-6">
            <Card title="Before vs after" description="Selected indicators under stress.">
              <StressCompareChart data={result.series} />
            </Card>
          </div>
          <Card title="Metric comparison">
            <DataTable
              columns={metricColumns}
              data={result.metrics}
              rowKey={(r) => r.key}
            />
          </Card>
        </>
      ) : (
        <ErrorState message="No result for this scenario." />
      )}
    </div>
  )
}
