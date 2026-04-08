/**
 * In dev, Vite proxies `/api` → FastAPI (see vite.config.ts).
 * Set VITE_API_BASE_URL when the UI is served separately from the API.
 */
export function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (base && base.length > 0) {
    return base.replace(/\/$/, '')
  }
  return ''
}

export function apiUrl(path: string): string {
  const base = apiBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  if (!base) return p
  return `${base}${p}`
}
