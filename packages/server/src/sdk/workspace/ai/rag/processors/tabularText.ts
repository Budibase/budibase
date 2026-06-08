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

interface TabularRowsSection {
  label: string
  rows: string[][]
}

interface StringifyRowsForRagInput {
  documentLabel: string
  sections: TabularRowsSection[]
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

const getRowReference = (sectionLabel: string, rowNumber: number) => {
  if (sectionLabel.startsWith("Sheet: ")) {
    return `Row ${rowNumber} in Sheet ${sectionLabel.slice("Sheet: ".length)}`
  }
  if (sectionLabel.startsWith("Table: ")) {
    return `Row ${rowNumber} in ${sectionLabel.slice("Table: ".length)}`
  }
  return `Row ${rowNumber} in ${sectionLabel}`
}

export const isTabularKnowledgeFile = ({
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

const getDocumentLabel = ({
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

const getWorksheetRows = (worksheet: XLSX.WorkSheet) =>
  XLSX.utils
    .sheet_to_json<string[]>(worksheet, {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    })
    .map(row => trimTrailingEmptyCells(row.map(normalizeCellValue)))
    .filter(hasContent)

const getWorkbookSections = ({
  filename,
  mimetype,
  buffer,
}: KnowledgeFileIngestionPayload): StringifyRowsForRagInput => {
  const workbook = parseWorkbook({ filename, mimetype, buffer })
  const isDelimitedFile = !!getDelimitedSeparator({ filename, mimetype })
  const sections: TabularRowsSection[] = []

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    if (!worksheet) {
      continue
    }

    const rows = getWorksheetRows(worksheet)
    if (rows.length === 0) {
      continue
    }

    sections.push({
      label: isDelimitedFile ? `Table: ${filename}` : `Sheet: ${sheetName}`,
      rows,
    })
  }

  return {
    documentLabel: getDocumentLabel({ filename, mimetype }),
    sections,
  }
}

export const stringifyRowsForRag = ({
  documentLabel,
  sections,
}: StringifyRowsForRagInput): string => {
  const output = [documentLabel]

  for (const section of sections) {
    const [columns, ...rows] = section.rows.filter(hasContent)
    if (!columns || columns.length === 0) {
      continue
    }

    output.push(section.label)

    if (rows.length === 0) {
      output.push(getRowReference(section.label, 1))
      columns.forEach((value, index) => {
        if (!value) {
          return
        }
        output.push(`Column ${index + 1}: ${value}`)
      })
      continue
    }

    const columnLabels = buildColumnLabels(columns)
    output.push(`Columns: ${columnLabels.join(" | ")}`)

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]
      if (!hasContent(row)) {
        continue
      }

      output.push(getRowReference(section.label, rowIndex + 2))
      row.forEach((value, index) => {
        if (!value) {
          return
        }
        output.push(`${columnLabels[index] || `Column ${index + 1}`}: ${value}`)
      })
    }
  }

  return output.join("\n").trim()
}

export const stringifyTabularFileForRag = (
  filename: string,
  buffer: Buffer,
  mimetype?: string
): string =>
  stringifyRowsForRag(getWorkbookSections({ filename, mimetype, buffer }))

export const prepareTabularKnowledgeFileForRagIngestion = ({
  filename,
  mimetype,
  buffer,
}: KnowledgeFileIngestionPayload): KnowledgeFileIngestionPayload => {
  if (!isTabularKnowledgeFile({ filename, mimetype })) {
    return { filename, mimetype, buffer }
  }

  try {
    const normalizedText = stringifyTabularFileForRag(
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
