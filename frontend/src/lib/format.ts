const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1, minimumFractionDigits: 0 })

export function formatInrCr(value: number): string {
  return `₹ ${inr.format(value)} Cr`
}

export function formatPct(value: number, digits = 1): string {
  return `${value >= 0 ? '' : '−'}${Math.abs(value).toFixed(digits)}%`
}

export function formatNumber(value: number, digits = 1): string {
  return inr.format(Number(value.toFixed(digits)))
}
