import ExcelJS from 'exceljs'
import type { ReportBrandAssets } from './loadAssets'
import {
  alcoKpis,
  dlrScenarios,
  institutionLine,
  irssRepricing,
  reportDisclaimer,
  slsBuckets,
} from './sampleData'

function dataUrlToBase64(dataUrl: string): string {
  const comma = dataUrl.indexOf(',')
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
}

const HEADER_FILL = 'FF1E3A5F'
const HEADER_FONT = 'FFFFFFFF'

function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: HEADER_FONT }, size: 11 }
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: HEADER_FILL },
  }
  row.alignment = { vertical: 'middle', horizontal: 'center' }
  row.height = 22
}

type SheetSpec = {
  code: string
  title: string
  subtitle: string
  headers: string[]
  rows: (string | number)[][]
}

function sheetSpec(code: string, displayName: string): SheetSpec {
  const u = code.toUpperCase()
  if (u === 'SLS')
    return {
      code: 'SLS',
      title: 'Structural Liquidity Statement',
      subtitle: 'Contractual buckets — illustrative',
      headers: ['Time bucket', 'Inflows (₹ Cr)', 'Outflows (₹ Cr)', 'Net gap (₹ Cr)', 'Cumulative gap (₹ Cr)'],
      rows: slsBuckets,
    }
  if (u === 'IRSS')
    return {
      code: 'IRSS',
      title: 'Interest Rate Sensitivity Statement',
      subtitle: 'Repricing profile — illustrative',
      headers: ['Repricing bucket', 'RSA (₹ Cr)', 'RSL (₹ Cr)', 'Gap (₹ Cr)'],
      rows: irssRepricing,
    }
  if (u === 'DLR')
    return {
      code: 'DLR',
      title: 'Dynamic Liquidity Report',
      subtitle: 'Scenario view — illustrative',
      headers: ['Scenario', 'LCR (%)', 'Liquidity buffer (₹ Cr)', 'HQLA (₹ Cr)', 'Assessment'],
      rows: dlrScenarios,
    }
  return {
    code: 'ALCO',
    title: displayName.includes('ALCO') ? displayName : 'ALCO pack — consolidated',
    subtitle: 'Management KPI snapshot',
    headers: ['Indicator', 'Value'],
    rows: alcoKpis,
  }
}

export async function downloadSampleExcel(
  reportCode: string,
  reportDisplayName: string,
  assets: ReportBrandAssets,
): Promise<void> {
  const spec = sheetSpec(reportCode, reportDisplayName)
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Assimilate Banking ALM'
  wb.created = new Date()
  wb.modified = new Date()

  const cover = wb.addWorksheet('Cover', {
    pageSetup: { paperSize: 9, orientation: 'portrait' },
  })
  cover.columns = [{ width: 14 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }]

  try {
    const wordId = wb.addImage({
      base64: dataUrlToBase64(assets.wordmarkDataUrl),
      extension: 'png',
    })
    cover.addImage(wordId, {
      tl: { col: 0.2, row: 0.5 },
      ext: { width: 320, height: 64 },
    })
  } catch {
    /* wordmark optional if corrupt */
  }

  cover.mergeCells('A5:E5')
  const titleCell = cover.getCell('A5')
  titleCell.value = spec.title
  titleCell.font = { size: 18, bold: true, color: { argb: HEADER_FILL } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' }

  cover.mergeCells('A6:E6')
  cover.getCell('A6').value = spec.subtitle
  cover.getCell('A6').font = { size: 11, color: { argb: 'FF64748B' } }

  cover.getCell('A8').value = 'Report code'
  cover.getCell('B8').value = spec.code
  cover.getCell('A9').value = 'Institution'
  cover.getCell('B9').value = institutionLine
  cover.getCell('A10').value = 'Generated (IST)'
  cover.getCell('B10').value = new Date().toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
  cover.getCell('A12').value = reportDisclaimer
  cover.mergeCells('A12:E14')
  cover.getCell('A12').alignment = { wrapText: true, vertical: 'top' }
  cover.getCell('A12').font = { size: 10, italic: true, color: { argb: 'FFB45309' } }

  const dataSheet = wb.addWorksheet(spec.code, {
    views: [{ state: 'frozen', ySplit: 1 }],
  })
  dataSheet.addRow(spec.headers)
  styleHeaderRow(dataSheet.getRow(1))
  for (const r of spec.rows) {
    dataSheet.addRow(r)
  }
  dataSheet.columns = spec.headers.map((_, i) => ({
    width: i === 0 ? 22 : 16,
  }))
  for (let r = 2; r <= dataSheet.rowCount; r++) {
    const row = dataSheet.getRow(r)
    row.alignment = { vertical: 'middle' }
    for (let c = 1; c <= spec.headers.length; c++) {
      const cell = row.getCell(c)
      if (c > 1 && typeof cell.value === 'number') {
        cell.numFmt = '#,##0.0'
      }
    }
  }

  const buf = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${spec.code}_sample_${new Date().toISOString().slice(0, 10)}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
