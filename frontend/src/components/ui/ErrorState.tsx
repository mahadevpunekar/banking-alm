import { AlertCircle } from 'lucide-react'

type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-sm border border-red-200/90 bg-red-50/70 p-8 text-center shadow-[0_1px_2px_rgba(12,25,41,0.04)]"
      role="alert"
    >
      <AlertCircle className="h-10 w-10 text-red-700" aria-hidden />
      <p className="max-w-md text-sm text-red-900">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-sm border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-900 shadow-sm hover:bg-red-50/80"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}
