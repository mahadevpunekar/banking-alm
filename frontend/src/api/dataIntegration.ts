import { apiUrl } from './baseUrl'

export type SourcesResponse = {
  supported_source_systems: string[]
  ingestion_modes: string[]
}

export type IngestRow = {
  entity_type?: string
  source_record_id?: string | null
  payload: Record<string, unknown>
}

export type BatchIngestRequest = {
  source_system: string
  mode: string
  business_date?: string | null
  external_batch_id?: string | null
  rows: IngestRow[]
}

export type BatchSummary = {
  id: string
  source_system: string
  mode: string
  business_date: string | null
  status: string
  row_count: number
  external_batch_id: string | null
  error_summary: string | null
  created_at: string
}

export type ReconciliationRequest = {
  business_date: string
  name?: string | null
}

export type ReconciliationSummary = {
  id: string
  name: string
  primary_source: string
  compare_source: string
  business_date: string
  status: string
  summary: Record<string, unknown> | null
  created_at: string
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { detail?: unknown }
    if (typeof j.detail === 'string') return j.detail
    if (Array.isArray(j.detail)) return JSON.stringify(j.detail)
  } catch {
    /* ignore */
  }
  return res.statusText || `HTTP ${res.status}`
}

export async function fetchSources(): Promise<SourcesResponse> {
  const res = await fetch(apiUrl('/api/v1/data-integration/health/sources'))
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<SourcesResponse>
}

export async function ingestBatch(body: BatchIngestRequest): Promise<BatchSummary> {
  const res = await fetch(apiUrl('/api/v1/data-integration/ingest/batch'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<BatchSummary>
}

export async function validateBatch(batchId: string): Promise<BatchSummary> {
  const res = await fetch(apiUrl(`/api/v1/data-integration/batches/${batchId}/validate`), {
    method: 'POST',
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<BatchSummary>
}

export async function getBatch(batchId: string): Promise<BatchSummary> {
  const res = await fetch(apiUrl(`/api/v1/data-integration/batches/${batchId}`))
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<BatchSummary>
}

export async function reconcileCbsGl(body: ReconciliationRequest): Promise<ReconciliationSummary> {
  const res = await fetch(apiUrl('/api/v1/data-integration/reconcile/cbs-gl'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<ReconciliationSummary>
}

export async function getReconcileRun(runId: string): Promise<ReconciliationSummary> {
  const res = await fetch(apiUrl(`/api/v1/data-integration/reconcile/${runId}`))
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<ReconciliationSummary>
}

export async function fetchApiHealth(): Promise<{ status: string }> {
  const res = await fetch(apiUrl('/health'))
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<{ status: string }>
}
