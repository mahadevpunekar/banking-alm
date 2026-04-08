import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { fetchReports } from '@/api/reportsService'
import { getCachedReportAssets } from '@/lib/reports/assetCache'
import { downloadSampleExcel } from '@/lib/reports/sampleExcel'
import { downloadSamplePdf } from '@/lib/reports/samplePdf'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAsyncResource } from '@/hooks/useAsyncResource'

type ExportKind = 'pdf' | 'excel'

export function ReportsPage() {
  const { data, isLoading, error, refetch } = useAsyncResource(fetchReports, [])
  const [exporting, setExporting] = useState<{ id: string; kind: ExportKind } | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const runExport = useCallback(
    async (reportId: string, reportCode: string, reportName: string, kind: ExportKind) => {
      setExportError(null)
      setExporting({ id: reportId, kind })
      try {
        const assets = await getCachedReportAssets()
        if (kind === 'pdf') {
          await downloadSamplePdf(reportCode, reportName, assets)
        } else {
          await downloadSampleExcel(reportCode, reportName, assets)
        }
      } catch (e) {
        setExportError(e instanceof Error ? e.message : 'Export failed')
      } finally {
        setExporting(null)
      }
    },
    [],
  )

  if (isLoading && !data) return <LoadingState label="Loading reports…" />
  if (error && !data) return <ErrorState message={error} onRetry={refetch} />
  if (!data) return null

  return (
    <div>
      <PageHeader
        title="Regulatory & management reports"
        subtitle="SLS, IRSS, DLR, and ALCO packs. Sample PDF and Excel include Assimilate branding; replace assets in src/assets when JasperReports is wired."
      />
      {error ? (
        <div className="mb-4">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      ) : null}
      {exportError ? (
        <div
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {exportError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {data.reports.map((r) => {
          const busyPdf = exporting?.id === r.id && exporting.kind === 'pdf'
          const busyXlsx = exporting?.id === r.id && exporting.kind === 'excel'
          const anyBusy = busyPdf || busyXlsx
          return (
            <Card key={r.id} padding="md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-900 px-2 py-0.5 text-xs font-bold text-white">
                      {r.code}
                    </span>
                    <h2 className="text-sm font-semibold text-slate-900">{r.name}</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{r.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Last generated:{' '}
                    {r.lastGenerated
                      ? new Date(r.lastGenerated).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : '—'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={anyBusy}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    onClick={() => runExport(r.id, r.code, r.name, 'pdf')}
                  >
                    {busyPdf ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    ) : (
                      <Download className="h-3.5 w-3.5" aria-hidden />
                    )}
                    PDF
                  </button>
                  <button
                    type="button"
                    disabled={anyBusy}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    onClick={() => runExport(r.id, r.code, r.name, 'excel')}
                  >
                    {busyXlsx ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    ) : (
                      <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
                    )}
                    Excel
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
