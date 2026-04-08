import { loadReportBrandAssets, type ReportBrandAssets } from './loadAssets'

let cache: Promise<ReportBrandAssets> | null = null

export function getCachedReportAssets(): Promise<ReportBrandAssets> {
  if (!cache) cache = loadReportBrandAssets()
  return cache
}
