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
} from '../api/dataIntegration'

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

function statusClass(status: string): string {
  const s = status.toUpperCase()
  if (s === 'VALIDATED' || s === 'MATCHED') return 'status-pill status-pill--ok'
  if (s === 'FAILED' || s === 'VARIANCE') return 'status-pill status-pill--warn'
  if (s === 'RECEIVED' || s === 'VALIDATING') return 'status-pill status-pill--pending'
  return 'status-pill'
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
    <div className="page">
      <h1 className="page-title">Data integration</h1>
      <p className="page-lead">
        Ingest normalized staging data, run the rules engine, and compare CBS vs GL totals for a
        business date.
      </p>

      {message ? (
        <div className="banner" role="status">
          {message}
        </div>
      ) : null}

      <div className="stack">
        <section className="panel">
          <h2 className="panel-title">Batch ingest</h2>
          <div className="form-grid">
            <label className="field">
              <span>Source system</span>
              <select
                value={sourceSystem}
                onChange={(e) => setSourceSystem(e.target.value)}
                disabled={busy}
              >
                {(sources?.supported_source_systems ?? ['CBS', 'GL', 'LOAN_MANAGEMENT', 'DEPOSIT', 'TREASURY']).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="field">
              <span>Mode</span>
              <select value={mode} onChange={(e) => setMode(e.target.value)} disabled={busy}>
                {(sources?.ingestion_modes ?? ['BATCH', 'REALTIME']).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Business date</span>
              <input
                type="date"
                value={businessDate}
                onChange={(e) => setBusinessDate(e.target.value)}
                disabled={busy}
              />
            </label>
            <label className="field field--wide">
              <span>External batch ID (optional)</span>
              <input
                type="text"
                value={externalBatchId}
                onChange={(e) => setExternalBatchId(e.target.value)}
                placeholder="e.g. CBS-EOD-20260408"
                disabled={busy}
              />
            </label>
            <label className="field field--full">
              <span>Rows (JSON array)</span>
              <textarea
                value={rowsJson}
                onChange={(e) => setRowsJson(e.target.value)}
                rows={12}
                spellCheck={false}
                disabled={busy}
                className="code-input"
              />
            </label>
          </div>
          <div className="actions">
            <button type="button" className="button button--primary" disabled={busy} onClick={onIngest}>
              {busy ? 'Working…' : 'Submit batch'}
            </button>
          </div>
        </section>

        <section className="panel">
          <h2 className="panel-title">Current batch</h2>
          {!batch ? (
            <p className="muted">Submit a batch to see status and validation.</p>
          ) : (
            <div className="batch-summary">
              <dl className="kv">
                <div>
                  <dt>ID</dt>
                  <dd>
                    <code>{batch.id}</code>
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={statusClass(batch.status)}>{batch.status}</span>
                  </dd>
                </div>
                <div>
                  <dt>Rows</dt>
                  <dd>{batch.row_count}</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>
                    {batch.source_system} · {batch.mode}
                  </dd>
                </div>
                {batch.error_summary ? (
                  <div className="kv--full">
                    <dt>Error summary</dt>
                    <dd className="text-error">{batch.error_summary}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="actions">
                <button type="button" className="button" disabled={busy} onClick={onValidate}>
                  Run validation
                </button>
                <button type="button" className="button button--ghost" disabled={busy} onClick={onRefreshBatch}>
                  Refresh
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="panel">
          <h2 className="panel-title">CBS vs GL reconciliation</h2>
          <p className="muted small">
            Aggregates validated staging rows by currency for <code>CBS</code> and <code>GL</code>{' '}
            for the selected business date.
          </p>
          <div className="form-grid form-grid--inline">
            <label className="field">
              <span>Business date</span>
              <input
                type="date"
                value={reconDate}
                onChange={(e) => setReconDate(e.target.value)}
                disabled={busy}
              />
            </label>
            <div className="actions actions--inline">
              <button type="button" className="button button--primary" disabled={busy} onClick={onReconcile}>
                Run reconciliation
              </button>
            </div>
          </div>

          {recon ? (
            <div className="recon-block">
              <div className="recon-meta">
                <span className={statusClass(recon.status)}>{recon.status}</span>
                <span className="muted small">
                  Run <code>{recon.id}</code>
                </span>
              </div>
              {variances && Object.keys(variances).length > 0 ? (
                <div className="banner banner--warn">
                  Variances by currency:{' '}
                  <code>{Object.keys(variances).join(', ')}</code>
                </div>
              ) : recon.status === 'MATCHED' ? (
                <p className="muted small">No currency variances for this date.</p>
              ) : null}

              {chartData.length > 0 ? (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="currency" tick={{ fill: 'var(--text-muted)' }} />
                      <YAxis tick={{ fill: 'var(--text-muted)' }} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--surface-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="CBS" fill="var(--chart-cbs)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="GL" fill="var(--chart-gl)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="muted small">No validated CBS/GL rows for this date yet.</p>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
