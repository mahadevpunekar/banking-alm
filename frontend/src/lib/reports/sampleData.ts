/** Shared sample figures for regulatory-style exports (illustrative only). */

export const institutionLine = 'Consolidated banking book — Demo Institution Ltd.'
export const reportDisclaimer =
  'This document is a sample output for demonstration. Figures are illustrative and not for regulatory submission.'

export const slsBuckets: (string | number)[][] = [
  ['Overnight', 28100, 40550, -12450, -12450],
  ['2–7 days', 9400, 12600, -3200, -15650],
  ['8–14 days', 7200, 5350, 1850, -13800],
  ['15–30 days', 11800, 7700, 4100, -9700],
  ['1–3 months', 22400, 15680, 6720, -2980],
  ['3–6 months', 18200, 12800, 5400, 2420],
  ['6–12 months', 14500, 11400, 3100, 5520],
  ['1–3 years', 31200, 28400, 2800, 8320],
  ['3–5 years', 19400, 18200, 1200, 9520],
  ['5 years +', 12030, 11140, 890, 10410],
]

export const irssRepricing: (string | number)[][] = [
  ['≤ 1 month', 48200, 52100, -3900],
  ['1–3 months', 32400, 28900, 3500],
  ['3–6 months', 26800, 24200, 2600],
  ['6–12 months', 31500, 29100, 2400],
  ['1–3 years', 44200, 38600, 5600],
  ['3–5 years', 28900, 22400, 6500],
  ['5 years +', 19400, 12800, 6600],
]

export const dlrScenarios: (string | number)[][] = [
  ['Base case', 124, 8400, 42100, 'Pass'],
  ['Mild stress', 118, 7620, 40500, 'Pass'],
  ['Severe stress', 108, 6100, 38800, 'Review'],
]

export const alcoKpis: (string | number)[][] = [
  ['Total assets (₹ Cr)', 184230.5],
  ['Total liabilities (₹ Cr)', 171842.3],
  ['Structural liquidity gap (₹ Cr)', -4128.7],
  ['NII — TTM (₹ Cr)', 3942.6],
  ['LCR (%)', 124],
  ['NSFR (%)', 112],
  ['EVE — base (₹ Cr)', 12180],
]
