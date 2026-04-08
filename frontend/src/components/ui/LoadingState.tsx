import { Loader2 } from 'lucide-react'

type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-sm border border-slate-300/80 bg-white p-8 text-slate-600 shadow-[0_1px_2px_rgba(12,25,41,0.04)]"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-[#1e3a8a]" aria-hidden />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
