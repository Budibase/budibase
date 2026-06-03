import { getKnowledgeFileExtension } from "@budibase/types"
import * as XLSX from "xlsx"

type TabularExtension = ".xls" | ".xlsx" | ".csv" | ".tsv"

const TABULAR_EXTENSIONS = new Set<TabularExtension>([
  ".xls",
  ".xlsx",
  ".csv",
  ".tsv",
])
const TABULAR_MIME_TYPES = new Set([
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "text/tab-separated-values",
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

const getDelimitedSeparator = ({
  filename,
  mimetype,
}: {
  filename: string
  mimetype?: string
}) => {
  const extension = getKnowledgeFileExtension(filename)
  const normalizedMimetype = mimetype?.trim().toLowerCase() || ""

  if (
    extension === ".tsv" ||
    normalizedMimetype === "text/tab-separated-values"
  ) {
    return "\t"
  }
  if (extension === ".csv" || normalizedMimetype === "text/csv") {
    return ","
  }
}

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
  if (TABULAR_EXTENSIONS.has(extension as TabularExtension)) {
    return true
  }

  const normalizedMimetype = mimetype?.trim().toLowerCase() || ""
  return TABULAR_MIME_TYPES.has(normalizedMimetype)
}

const parseWorkbook = ({
  filename,
  mimetype,
  buffer,
}: KnowledgeFileIngestionPayload) => {
  const separator = getDelimitedSeparator({ filename, mimetype })

  if (separator) {
    return XLSX.read(buffer.toString("utf8").replace(/^\uFEFF/, ""), {
      type: "string",
      raw: false,
      cellText: true,
      FS: separator,
    })
  }

  return XLSX.read(buffer, {
    type: "buffer",
    raw: false,
    cellText: true,
  })
}

const getWorkbookLabel = ({
  filename,
  mimetype,
}: {
  filename: string
  mimetype?: string
}) => {
  return getDelimitedSeparator({ filename, mimetype })
    ? `File: ${filename}`
    : `Workbook: ${filename}`
}

export const stringifySpreadsheetForRag = (
  filename: string,
  buffer: Buffer,
  mimetype?: string
): string => {
  const workbook = parseWorkbook({ filename, mimetype, buffer })
  const isDelimitedFile = !!getDelimitedSeparator({ filename, mimetype })
  const sections = [getWorkbookLabel({ filename, mimetype })]

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

    sections.push(
      isDelimitedFile ? `Table: ${filename}` : `Sheet: ${sheetName}`
    )

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
    const normalizedText = stringifySpreadsheetForRag(
      filename,
      buffer,
      mimetype
    )
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
      "Failed to normalize tabular knowledge file, falling back to raw upload",
      {
        filename,
        mimetype,
        error,
      }
    )
    return { filename, mimetype, buffer }
  }
}
