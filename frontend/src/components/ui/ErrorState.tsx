import { AlertCircle } from 'lucide-react'

type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50/60 p-8 text-center"
      role="alert"
    >
      <AlertCircle className="h-10 w-10 text-red-700" aria-hidden />
      <p className="max-w-md text-sm text-red-900">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-800 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}
