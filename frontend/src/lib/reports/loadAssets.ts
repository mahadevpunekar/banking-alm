import assimilateLogoSrc from '@/assets/assimilate_logo.png'

async function fetchAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load asset: ${url}`)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export type ReportBrandAssets = {
  wordmarkDataUrl: string
}

/** Loads wordmark PNG from `src/assets` as a data URL for PDF/Excel export. */
export async function loadReportBrandAssets(): Promise<ReportBrandAssets> {
  const wordmarkDataUrl = await fetchAsDataUrl(assimilateLogoSrc)
  return { wordmarkDataUrl }
}
