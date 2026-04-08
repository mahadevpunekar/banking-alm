/** When `VITE_API_MOCK` is not `'false'`, ALM services use mock payloads (default in dev). */
export function apiUsesMock(): boolean {
  return import.meta.env.VITE_API_MOCK !== 'false'
}
