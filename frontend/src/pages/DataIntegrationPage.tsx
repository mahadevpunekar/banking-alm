import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  fetchSources,
  getBatch,
  ingestBatch,
  reconcileCbsGl,
  validateBatch,
  type BatchSummary,
  type IngestRow,
  type ReconciliationSummary,
  type SourcesResponse,
} from '@/api/dataIntegration'
import { chartColors } from '@/components/charts/chartTheme'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

const defaultRowsJson = `[
  {
    "entity_type": "GENERIC",
    "source_record_id": "DEMO-001",
    "payload": {
      "amount": "100000",
      "currency": "INR",
      "business_date": "2026-04-08"
    }
  }
]`

function pillClass(status: string): string {
  const s = status.toUpperCase()
  const base = 'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold'
  if (s === 'VALIDATED' || s === 'MATCHED') return `${base} bg-emerald-50 text-emerald-800`
  if (s === 'FAILED' || s === 'VARIANCE') return `${base} bg-amber-50 text-amber-900`
  if (s === 'RECEIVED' || s === 'VALIDATING') return `${base} bg-slate-100 text-slate-700`
  return `${base} bg-slate-100 text-slate-800`
}

function chartFromReconciliation(summary: ReconciliationSummary | null) {
  if (!summary?.summary) return []
  const cbs = summary.summary.cbs_totals as Record<string, string> | undefined
  const gl = summary.summary.gl_totals as Record<string, string> | undefined
  if (!cbs && !gl) return []
  const ccys = new Set([...Object.keys(cbs ?? {}), ...Object.keys(gl ?? {})])
  return Array.from(ccys).map((ccy) => ({
    currency: ccy,
    CBS: cbs?.[ccy] != null ? Number(cbs[ccy]) : 0,
    GL: gl?.[ccy] != null ? Number(gl[ccy]) : 0,
  }))
}

export function DataIntegrationPage() {
  const [sources, setSources] = useState<SourcesResponse | null>(null)
  const [sourceSystem, setSourceSystem] = useState('CBS')
  const [mode, setMode] = useState('BATCH')
  const [businessDate, setBusinessDate] = useState('2026-04-08')
  const [externalBatchId, setExternalBatchId] = useState('')
  const [rowsJson, setRowsJson] = useState(defaultRowsJson)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [batch, setBatch] = useState<BatchSummary | null>(null)
  const [reconDate, setReconDate] = useState('2026-04-08')
  const [recon, setRecon] = useState<ReconciliationSummary | null>(null)

  useEffect(() => {
    fetchSources()
      .then(setSources)
      .catch(() => setSources(null))
  }, [])

  const chartData = useMemo(() => chartFromReconciliation(recon), [recon])

  const onIngest = useCallback(async () => {
    setMessage(null)
    let rows: unknown
    try {
      rows = JSON.parse(rowsJson)
    } catch {
      setMessage('Rows must be valid JSON.')
      return
    }
    if (!Array.isArray(rows)) {
      setMessage('Rows must be a JSON array.')
      return
    }
    setBusy(true)
    try {
      const b = await ingestBatch({
        source_system: sourceSystem,
        mode,
        business_date: businessDate || null,
        external_batch_id: externalBatchId || null,
        rows: rows as IngestRow[],
      })
      setBatch(b)
      setMessage(`Batch created: ${b.id}`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Ingest failed')
    } finally {
      setBusy(false)
    }
  }, [rowsJson, sourceSystem, mode, businessDate, externalBatchId])

  const onValidate = useCallback(async () => {
    if (!batch) return
    setMessage(null)
    setBusy(true)
    try {
      const b = await validateBatch(batch.id)
      setBatch(b)
      setMessage(`Validation finished: ${b.status}`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Validate failed')
    } finally {
      setBusy(false)
    }
  }, [batch])

  const onRefreshBatch = useCallback(async () => {
    if (!batch) return
    setMessage(null)
    setBusy(true)
    try {
      const b = await getBatch(batch.id)
      setBatch(b)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Refresh failed')
    } finally {
      setBusy(false)
    }
  }, [batch])

  const onReconcile = useCallback(async () => {
    setMessage(null)
    setBusy(true)
    try {
      const r = await reconcileCbsGl({ business_date: reconDate })
      setRecon(r)
      setMessage(`Reconciliation run: ${r.status}`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Reconciliation failed')
    } finally {
      setBusy(false)
    }
  }, [reconDate])

  const variances = recon?.summary?.variances as Record<string, unknown> | undefined

  return (
    <div>
      <PageHeader
        title="Data integration"
        subtitle="Module 1: batch ingest, validation, and CBS vs GL reconciliation. Calls FastAPI when the service is running."
      />

      {message ? (
        <div
          className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800"
          role="status"
        >
          {message}
        </div>
      ) : null}

      <div className="space-y-6">
        <Card title="Batch ingest" description="Submit staging rows for validation.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-medium text-slate-600">
              Source system
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                value={sourceSystem}
                onChange={(e) => setSourceSystem(e.target.value)}
                disabled={busy}
              >
                {(sources?.supported_source_systems ?? [
                  'CBS',
                  'GL',
                  'LOAN_MANAGEMENT',
                  'DEPOSIT',
                  'TREASURY',
                ]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">
              Mode
              <select
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                disabled={busy}
              >
                {(sources?.ingestion_modes ?? ['BATCH', 'REALTIME']).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">
              Business date
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                value={businessDate}
                onChange={(e) => setBusinessDate(e.target.value)}
                disabled={busy}
              />
            </label>
            <label className="text-xs font-medium text-slate-600">
              External batch ID
              <input
                type="text"
                placeholder="Optional"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                value={externalBatchId}
                onChange={(e) => setExternalBatchId(e.target.value)}
                disabled={busy}
              />
            </label>
          </div>
          <label className="mt-4 block text-xs font-medium text-slate-600">
            Rows (JSON)
            <textarea
              value={rowsJson}
              onChange={(e) => setRowsJson(e.target.value)}
              rows={10}
              spellCheck={false}
              disabled={busy}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs text-slate-800"
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={onIngest}
            className="mt-4 rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {busy ? 'Working…' : 'Submit batch'}
          </button>
        </Card>

        <Card title="Current batch">
          {!batch ? (
            <p className="text-sm text-slate-500">Submit a batch to see status.</p>
          ) : (
            <div className="space-y-4">
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">ID</dt>
                  <dd className="mt-1 font-mono text-xs text-slate-900">{batch.id}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">Status</dt>
                  <dd className="mt-1">
                    <span className={pillClass(batch.status)}>{batch.status}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">Rows</dt>
                  <dd className="mt-1 text-sm text-slate-900">{batch.row_count}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-500">Source</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {batch.source_system} · {batch.mode}
                  </dd>
                </div>
                {batch.error_summary ? (
                  <div className="sm:col-span-2 lg:col-span-4">
                    <dt className="text-xs font-medium uppercase text-slate-500">Error summary</dt>
                    <dd className="mt-1 text-sm text-amber-900">{batch.error_summary}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={onValidate}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Run validation
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onRefreshBatch}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </Card>

        <Card
          title="CBS vs GL reconciliation"
          description="Aggregates validated staging by currency for the business date."
        >
          <div className="flex flex-wrap items-end gap-4">
            <label className="text-xs font-medium text-slate-600">
              Business date
              <input
                type="date"
                className="mt-1 block rounded-md border border-slate-200 px-3 py-2 text-sm"
                value={reconDate}
                onChange={(e) => setReconDate(e.target.value)}
                disabled={busy}
              />
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={onReconcile}
              className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
            >
              Run reconciliation
            </button>
          </div>
          {recon ? (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={pillClass(recon.status)}>{recon.status}</span>
                <span className="text-xs text-slate-500">
                  Run <code className="rounded bg-slate-100 px-1">{recon.id}</code>
                </span>
              </div>
              {variances && Object.keys(variances).length > 0 ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Variances: <code>{Object.keys(variances).join(', ')}</code>
                </p>
              ) : null}
              {chartData.length > 0 ? (
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="currency" tick={{ fontSize: 11, fill: chartColors.axis }} />
                      <YAxis tick={{ fontSize: 11, fill: chartColors.axis }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="CBS" fill={chartColors.primary} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="GL" fill={chartColors.secondary} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No validated CBS/GL data for this date.</p>
              )}
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
