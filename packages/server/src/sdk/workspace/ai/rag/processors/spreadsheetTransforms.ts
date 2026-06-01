import { getKnowledgeFileExtension } from "@budibase/types"
import * as XLSX from "xlsx"

type SpreadsheetIngestStrategy = "native" | "row_batch"

interface IngestVariant {
  strategy: SpreadsheetIngestStrategy
  filename: string
  mimetype?: string
  buffer: Buffer
}

interface SpreadsheetSheetData {
  name: string
  columns: string[]
  rows: Array<{
    rowNumber: number
    values: string[]
  }>
}

const SPREADSHEET_EXTENSIONS = new Set([".xls", ".xlsx"])
const SPREADSHEET_MIME_TYPES = new Set([
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
])
const SPREADSHEET_ROW_BATCH_SIZE = 100

const normalizeString = (value: unknown) =>
  String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim()

const isNonEmptyRow = (row: string[]) => row.some(Boolean)

const getNonEmptyCellCount = (row: string[]) =>
  row.filter(value => Boolean(value)).length

const normalizeColumns = (row: string[]) => {
  const usedNames = new Map<string, number>()

  return row.map((value, index) => {
    const baseName = value || `Column ${index + 1}`
    const seen = usedNames.get(baseName) || 0
    usedNames.set(baseName, seen + 1)
    return seen === 0 ? baseName : `${baseName} (${seen + 1})`
  })
}

const parseWorkbook = (buffer: Buffer): SpreadsheetSheetData[] => {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellText: true,
    cellDates: true,
  })

  return workbook.SheetNames.map(name => {
    const sheet = workbook.Sheets[name]
    const rawRows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    }) as unknown[][]

    const rows = rawRows.map(row => row.map(normalizeString))
    const firstNonEmptyRowIndex = rows.findIndex(isNonEmptyRow)
    if (firstNonEmptyRowIndex === -1) {
      return {
        name,
        columns: [],
        rows: [],
      }
    }

    const firstNonEmptyRow = rows[firstNonEmptyRowIndex]
    const likelyHeaderIndex =
      getNonEmptyCellCount(firstNonEmptyRow) === 1
        ? rows.findIndex(
            (row, index) =>
              index > firstNonEmptyRowIndex && getNonEmptyCellCount(row) > 1
          )
        : -1
    const headerIndex =
      likelyHeaderIndex === -1 ? firstNonEmptyRowIndex : likelyHeaderIndex
    const columnCount = Math.max(...rows.map(row => row.length))
    const headerRow = Array.from(
      { length: columnCount },
      (_, index) => rows[headerIndex][index] || ""
    )
    const columns = normalizeColumns(headerRow)
    const dataRows = rows
      .slice(headerIndex + 1)
      .map((row, index) => ({
        rowNumber: headerIndex + index + 2,
        values: columns.map((_, columnIndex) =>
          normalizeString(row[columnIndex])
        ),
      }))
      .filter(row => isNonEmptyRow(row.values))

    return {
      name,
      columns,
      rows: dataRows,
    }
  })
}

export const isSpreadsheetKnowledgeFile = ({
  filename,
  mimetype,
}: {
  filename?: string
  mimetype?: string
}) => {
  const extension = getKnowledgeFileExtension(filename)
  if (extension && SPREADSHEET_EXTENSIONS.has(extension)) {
    return true
  }

  const normalizedMimetype = normalizeString(mimetype).toLowerCase()
  return SPREADSHEET_MIME_TYPES.has(normalizedMimetype)
}

const toRowText = (sheet: SpreadsheetSheetData, filename: string) => {
  const rows = sheet.rows.map(row => {
    const cells = row.values
      .map((value, index) => {
        if (!value) {
          return ""
        }
        return `${sheet.columns[index]}=${value}`
      })
      .filter(Boolean)

    return `Row ${row.rowNumber}: ${cells.join(" | ")}`
  })

  const firstRowNumber = sheet.rows[0]?.rowNumber
  const lastRowNumber = sheet.rows[sheet.rows.length - 1]?.rowNumber

  return [
    `Spreadsheet: ${filename}`,
    `Sheet: ${sheet.name}`,
    `Rows: ${firstRowNumber}-${lastRowNumber}`,
    `Columns: ${sheet.columns.join(" | ")}`,
    "",
    rows.join("\n"),
  ].join("\n")
}

const buildSpreadsheetRowBatchVariants = (
  sheets: SpreadsheetSheetData[],
  filename: string
): IngestVariant[] =>
  sheets.flatMap(sheet => {
    if (sheet.columns.length === 0 || sheet.rows.length === 0) {
      return []
    }

    const variants: IngestVariant[] = []
    for (
      let index = 0;
      index < sheet.rows.length;
      index += SPREADSHEET_ROW_BATCH_SIZE
    ) {
      const batchSheet = {
        ...sheet,
        rows: sheet.rows.slice(index, index + SPREADSHEET_ROW_BATCH_SIZE),
      }
      variants.push({
        strategy: "row_batch",
        filename,
        mimetype: "text/plain",
        buffer: Buffer.from(toRowText(batchSheet, filename), "utf8"),
      })
    }
    return variants
  })

export const buildSpreadsheetIngestVariants = ({
  filename,
  mimetype,
  buffer,
}: {
  filename: string
  mimetype?: string
  buffer: Buffer
}): IngestVariant[] => {
  if (!isSpreadsheetKnowledgeFile({ filename, mimetype })) {
    return [
      {
        strategy: "native",
        filename,
        mimetype,
        buffer,
      },
    ]
  }

  const workbook = parseWorkbook(buffer)

  return [
    {
      strategy: "native",
      filename,
      mimetype,
      buffer,
    },
    ...buildSpreadsheetRowBatchVariants(workbook, filename),
  ]
}
