import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchApiHealth, fetchSources } from '../api/dataIntegration'

export function HomePage() {
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  const [sources, setSources] = useState<string[] | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [h, s] = await Promise.all([fetchApiHealth(), fetchSources()])
        if (cancelled) return
        setApiOk(h.status === 'ok')
        setSources(s.supported_source_systems)
        setErr(null)
      } catch (e) {
        if (cancelled) return
        setApiOk(false)
        setSources(null)
        setErr(e instanceof Error ? e.message : 'Could not reach API')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Overview</h1>
      <p className="page-lead">
        Foundation layer for ALM: ingest banking data, validate, reconcile CBS vs GL. NestJS and
        Python calculation services can sit behind this API later; this UI talks to the current
        FastAPI module.
      </p>

      <div className="card-grid">
        <section className="card">
          <h2 className="card-title">API status</h2>
          {err ? (
            <p className="text-error">{err}</p>
          ) : apiOk === null ? (
            <p className="muted">Checking…</p>
          ) : apiOk ? (
            <p className="status-pill status-pill--ok">Connected</p>
          ) : (
            <p className="status-pill status-pill--bad">Unreachable</p>
          )}
          <p className="muted small">
            Start FastAPI: <code>uvicorn banking_alm.main:app --reload</code>
          </p>
        </section>

        <section className="card">
          <h2 className="card-title">Source systems</h2>
          {sources ? (
            <ul className="tag-list">
              {sources.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">—</p>
          )}
        </section>

        <section className="card card--cta">
          <h2 className="card-title">Data integration</h2>
          <p className="muted">Batch ingest, validation engine, CBS–GL reconciliation.</p>
          <Link to="/data-integration" className="button button--primary">
            Open module
          </Link>
        </section>
      </div>
    </div>
  )
}
