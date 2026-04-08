import { Loader2 } from 'lucide-react'

type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-8 text-slate-600"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-700" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  )
}
