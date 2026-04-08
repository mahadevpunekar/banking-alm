import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import type { ReportBrandAssets } from './loadAssets'
import {
  alcoKpis,
  dlrScenarios,
  institutionLine,
  irssRepricing,
  reportDisclaimer,
  slsBuckets,
} from './sampleData'

const BRAND_RGB: [number, number, number] = [30, 58, 95]

function mmImageHeight(naturalW: number, naturalH: number, targetWmm: number): number {
  return (naturalH / naturalW) * targetWmm
}

function naturalSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = dataUrl
  })
}

function addFooters(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  const pageH = doc.internal.pageSize.getHeight()
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 14
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7.5)
    doc.setTextColor(90, 90, 90)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Assimilate — Banking ALM  |  Confidential  |  Page ${i} of ${pageCount}`,
      margin,
      pageH - 6,
    )
    doc.text('Sample report — not for supervisory filing', pageW - margin, pageH - 6, {
      align: 'right',
    })
  }
}

type ReportSpec = {
  code: string
  title: string
  summary: string
  head: string[][]
  body: (string | number)[][]
}

function specForCode(code: string, displayName: string): ReportSpec {
  const upper = code.toUpperCase()
  if (upper === 'SLS' || upper.includes('SLS'))
    return {
      code: 'SLS',
      title: 'Structural Liquidity Statement',
      summary:
        'Contractual inflows, outflows, and cumulative liquidity gap by RBI standard maturity bucket. Behavioural overlays flagged separately in production.',
      head: [['Time bucket', 'Inflows (₹ Cr)', 'Outflows (₹ Cr)', 'Net gap (₹ Cr)', 'Cumulative gap (₹ Cr)']],
      body: slsBuckets,
    }
  if (upper === 'IRSS' || upper.includes('IRSS'))
    return {
      code: 'IRSS',
      title: 'Interest Rate Sensitivity Statement',
      summary:
        'Rate-sensitive assets and liabilities and repricing gap by bucket. EVE and NII sensitivity are modelled in the IRRBB engine.',
      head: [['Repricing bucket', 'RSA (₹ Cr)', 'RSL (₹ Cr)', 'Gap (₹ Cr)']],
      body: irssRepricing,
    }
  if (upper === 'DLR' || upper.includes('DLR'))
    return {
      code: 'DLR',
      title: 'Dynamic Liquidity Report',
      summary:
        'Forward-looking liquidity metrics under base and stressed paths. HQLA and encumbrance detail in annex (sample).',
      head: [['Scenario', 'LCR (%)', 'Liquidity buffer (₹ Cr)', 'HQLA (₹ Cr)', 'Assessment']],
      body: dlrScenarios,
    }
  return {
    code: 'ALCO',
    title: displayName.includes('ALCO') ? displayName : 'ALCO pack — consolidated',
    summary:
      'Snapshot KPIs linking liquidity, IRRBB, and earnings for ALCO deliberation. Capital and FTP bridges in full pack.',
    head: [['Indicator', 'Value']],
    body: alcoKpis,
  }
}

export async function downloadSamplePdf(
  reportCode: string,
  reportDisplayName: string,
  assets: ReportBrandAssets,
): Promise<void> {
  const spec = specForCode(reportCode, reportDisplayName)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margin = 14
  const pageW = doc.internal.pageSize.getWidth()
  let y = margin

  const { w: ww, h: wh } = await naturalSize(assets.wordmarkDataUrl)
  const wordTargetW = Math.min(95, pageW - margin * 2)
  const wordH = mmImageHeight(ww, wh, wordTargetW)
  doc.addImage(assets.wordmarkDataUrl, 'PNG', margin, y, wordTargetW, wordH)

  y += wordH + 6
  doc.setDrawColor(...BRAND_RGB)
  doc.setLineWidth(0.35)
  doc.line(margin, y, pageW - margin, y)
  y += 5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...BRAND_RGB)
  doc.text(spec.title, margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  doc.text(`${spec.code}  |  ${institutionLine}`, margin, y)
  y += 5
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}`, margin, y)
  y += 8

  doc.setFontSize(8.5)
  doc.setTextColor(45, 45, 45)
  const summaryLines = doc.splitTextToSize(spec.summary, pageW - margin * 2)
  doc.text(summaryLines, margin, y)
  y += summaryLines.length * 3.8 + 4

  doc.setFontSize(8)
  doc.setTextColor(120, 30, 30)
  doc.text(doc.splitTextToSize(reportDisclaimer, pageW - margin * 2), margin, y)
  y += 12

  autoTable(doc, {
    startY: y,
    head: spec.head,
    body: spec.body.map((row) => row.map((c) => String(c))),
    theme: 'striped',
    headStyles: {
      fillColor: BRAND_RGB,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { cellPadding: 2.2, lineColor: [220, 220, 220], lineWidth: 0.1 },
    margin: { left: margin, right: margin },
  })

  type DocWithTable = jsPDF & { lastAutoTable?: { finalY: number } }
  const finalY = (doc as DocWithTable).lastAutoTable?.finalY
  if (finalY) {
    let ny = finalY + 10
    if (ny > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      ny = margin
    }
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 80)
    doc.setFont('helvetica', 'italic')
    doc.text(
      doc.splitTextToSize(
        'Prepared by: Assimilate Banking ALM Platform  |  Maker-checker and audit trail apply in production.',
        pageW - margin * 2,
      ),
      margin,
      ny,
    )
  }

  addFooters(doc)

  const safeFile = `${spec.code}_sample_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(safeFile)
}
