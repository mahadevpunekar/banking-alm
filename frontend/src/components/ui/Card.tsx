import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'none'
}

export function Card({
  title,
  description,
  action,
  children,
  className = '',
  padding = 'md',
}: CardProps) {
  const pad = padding === 'none' ? '' : padding === 'sm' ? 'p-4' : 'p-5'
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {(title || description || action) && (
        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? <h2 className="text-sm font-semibold text-slate-900">{title}</h2> : null}
            {description ? (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            ) : null}
          </div>
          {action ? <div className="mt-2 shrink-0 sm:mt-0">{action}</div> : null}
        </div>
      )}
      <div className={pad}>{children}</div>
    </section>
  )
}
