type PageHeaderProps = {
  title: string
  subtitle?: string
  /** e.g. module name — enterprise apps often show context above the title */
  contextLabel?: string
}

export function PageHeader({ title, subtitle, contextLabel = 'Treasury & ALM' }: PageHeaderProps) {
  return (
    <header className="mb-5 border-b border-slate-300/70 pb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{contextLabel}</p>
      <h1 className="mt-1 text-lg font-semibold tracking-tight text-[var(--color-alm-heading)] sm:text-xl">
        {title}
      </h1>
      {subtitle ? <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600">{subtitle}</p> : null}
    </header>
  )
}
