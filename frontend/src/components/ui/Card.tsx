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
      className={`rounded-sm border border-slate-300/80 bg-[var(--color-alm-surface)] shadow-[0_1px_2px_rgba(12,25,41,0.04)] ${className}`}
    >
      {(title || description || action) && (
        <div className="flex flex-col gap-1 border-b border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-sm font-semibold tracking-tight text-[var(--color-alm-heading)]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
            ) : null}
          </div>
          {action ? <div className="mt-2 shrink-0 sm:mt-0">{action}</div> : null}
        </div>
      )}
      <div className={pad}>{children}</div>
    </section>
  )
}
