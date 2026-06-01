import { getKnowledgeFileExtension } from "@budibase/types"
import * as XLSX from "xlsx"

const SPREADSHEET_EXTENSIONS = new Set([".xls", ".xlsx"])
const SPREADSHEET_MIME_TYPES = new Set([
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
])

interface KnowledgeFileIngestionPayload {
  filename: string
  mimetype?: string
  buffer: Buffer
}

const normalizeCellValue = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()

const trimTrailingEmptyCells = (row: string[]) => {
  const trimmed = [...row]
  while (trimmed.length > 0 && !trimmed[trimmed.length - 1]) {
    trimmed.pop()
  }
  return trimmed
}

const hasContent = (row: string[]) => row.some(Boolean)

const buildColumnLabels = (headerRow: string[]) => {
  const seen = new Map<string, number>()

  return headerRow.map((value, index) => {
    const baseLabel = value || `Column ${index + 1}`
    const count = (seen.get(baseLabel) || 0) + 1
    seen.set(baseLabel, count)
    return count === 1 ? baseLabel : `${baseLabel} ${count}`
  })
}

export const isSpreadsheetKnowledgeFile = ({
  filename,
  mimetype,
}: {
  filename: string
  mimetype?: string
}) => {
  const extension = getKnowledgeFileExtension(filename)
  if (SPREADSHEET_EXTENSIONS.has(extension as ".xls" | ".xlsx")) {
    return true
  }

  const normalizedMimetype = mimetype?.trim().toLowerCase() || ""
  return SPREADSHEET_MIME_TYPES.has(normalizedMimetype)
}

export const stringifySpreadsheetForRag = (
  filename: string,
  buffer: Buffer
): string => {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    raw: false,
    cellText: true,
  })
  const sections = [`Workbook: ${filename}`]

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    if (!worksheet) {
      continue
    }

    const rows = XLSX.utils
      .sheet_to_json<string[]>(worksheet, {
        header: 1,
        raw: false,
        defval: "",
        blankrows: false,
      })
      .map(row => trimTrailingEmptyCells(row.map(normalizeCellValue)))
      .filter(hasContent)

    if (rows.length === 0) {
      continue
    }

    sections.push(`Sheet: ${sheetName}`)

    if (rows.length === 1) {
      sections.push("Row 1")
      rows[0].forEach((value, index) => {
        if (!value) {
          return
        }
        sections.push(`Column ${index + 1}: ${value}`)
      })
      continue
    }

    const columnLabels = buildColumnLabels(rows[0])
    sections.push(`Columns: ${columnLabels.join(" | ")}`)

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]
      if (!hasContent(row)) {
        continue
      }

      sections.push(`Row ${rowIndex + 1}`)
      row.forEach((value, index) => {
        if (!value) {
          return
        }
        sections.push(
          `${columnLabels[index] || `Column ${index + 1}`}: ${value}`
        )
      })
    }
  }

  return sections.join("\n").trim()
}

export const prepareKnowledgeFileForRagIngestion = ({
  filename,
  mimetype,
  buffer,
}: KnowledgeFileIngestionPayload): KnowledgeFileIngestionPayload => {
  if (!isSpreadsheetKnowledgeFile({ filename, mimetype })) {
    return { filename, mimetype, buffer }
  }

  try {
    const normalizedText = stringifySpreadsheetForRag(filename, buffer)
    if (!normalizedText) {
      return { filename, mimetype, buffer }
    }

    return {
      filename,
      mimetype: "text/plain",
      buffer: Buffer.from(normalizedText, "utf8"),
    }
  } catch (error) {
    console.error(
      "Failed to normalize spreadsheet knowledge file, falling back to raw upload",
      {
        filename,
        mimetype,
        error,
      }
    )
    return { filename, mimetype, buffer }
  }
}
