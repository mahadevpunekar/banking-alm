import axios from 'axios'
import { apiBaseUrl } from './baseUrl'

/**
 * Axios client for ALM APIs. With Vite proxy, baseURL '' + path `/api/...` hits FastAPI or Nest.
 * When `VITE_API_MOCK` is not `'false'`, services return mock data without using this client.
 */
export const almClient = axios.create({
  baseURL: apiBaseUrl() || '',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

almClient.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err.response?.data?.detail ??
      err.response?.data?.message ??
      err.message ??
      'Request failed'
    return Promise.reject(new Error(typeof msg === 'string' ? msg : JSON.stringify(msg)))
  },
)
