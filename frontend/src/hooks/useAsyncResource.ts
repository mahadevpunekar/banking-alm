import { useCallback, useEffect, useState } from 'react'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export function useAsyncResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown>,
) {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<AsyncStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => {
    setTick((t) => t + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setError(null)
    fetcher(controller.signal)
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch((e) => {
        if (controller.signal.aborted || (e instanceof DOMException && e.name === 'AbortError')) {
          return
        }
        setError(e instanceof Error ? e.message : 'Something went wrong')
        setStatus('error')
      })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tick + deps trigger reload
  }, [tick, ...deps])

  return { data, status, error, refetch, isLoading: status === 'loading' }
}
