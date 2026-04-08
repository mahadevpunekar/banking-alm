import { almClient } from './client'

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

export async function fetchSources(): Promise<SourcesResponse> {
  const { data } = await almClient.get<SourcesResponse>('/api/v1/data-integration/health/sources')
  return data
}

export async function ingestBatch(body: BatchIngestRequest): Promise<BatchSummary> {
  const { data } = await almClient.post<BatchSummary>('/api/v1/data-integration/ingest/batch', body)
  return data
}

export async function validateBatch(batchId: string): Promise<BatchSummary> {
  const { data } = await almClient.post<BatchSummary>(
    `/api/v1/data-integration/batches/${batchId}/validate`,
  )
  return data
}

export async function getBatch(batchId: string): Promise<BatchSummary> {
  const { data } = await almClient.get<BatchSummary>(`/api/v1/data-integration/batches/${batchId}`)
  return data
}

export async function reconcileCbsGl(body: ReconciliationRequest): Promise<ReconciliationSummary> {
  const { data } = await almClient.post<ReconciliationSummary>(
    '/api/v1/data-integration/reconcile/cbs-gl',
    body,
  )
  return data
}

export async function getReconcileRun(runId: string): Promise<ReconciliationSummary> {
  const { data } = await almClient.get<ReconciliationSummary>(
    `/api/v1/data-integration/reconcile/${runId}`,
  )
  return data
}
