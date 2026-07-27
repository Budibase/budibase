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

interface TabularSection {
  label: string
  values: string[][]
}

interface StringifyRowsForRagInput {
  documentLabel: string
  sections: TabularSection[]
}

interface SearchTabularRowsForExactMatchesInput
  extends KnowledgeFileIngestionPayload {
  query: string
  maxMatches?: number
}

export interface TabularRowExactMatch {
  chunkText: string
  columnLabels: string[]
  matchedValues: string[]
  rowValues: string[]
}

const DEFAULT_MAX_EXACT_MATCHES = 20

const normalizeCellValue = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()

const normalizeSearchValue = (value: string) =>
  normalizeCellValue(value).toLowerCase()

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const trimTrailingEmptyCells = (row: string[]) => {
  const trimmed = [...row]
  while (trimmed.length > 0 && !trimmed[trimmed.length - 1]) {
    trimmed.pop()
  }
  return trimmed
}

const hasContent = (row: string[]) => row.some(Boolean)

const isSearchableExactValue = (value: string) => {
  if (value.length < 3) {
    return false
  }
  return /[a-z]/i.test(value) || value.length >= 6
}

const queryContainsExactCellValue = (query: string, value: string) => {
  const normalizedValue = normalizeSearchValue(value)
  if (!isSearchableExactValue(normalizedValue)) {
    return false
  }

  return queryContainsSearchTerm(query, normalizedValue)
}

const queryContainsSearchTerm = (query: string, value: string) => {
  const normalizedValue = normalizeSearchValue(value)
  if (!normalizedValue) {
    return false
  }

  return new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(normalizedValue)}($|[^a-z0-9])`,
    "i"
  ).test(query)
}

const queryContainsColumnValue = (
  query: string,
  columnLabel: string,
  value: string
) => {
  return (
    queryContainsSearchTerm(query, columnLabel) &&
    queryContainsSearchTerm(query, value)
  )
}

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

const stringifyRowForRag = ({
  documentLabel,
  sectionLabel,
  columnLabels,
  row,
  rowNumber,
}: {
  documentLabel: string
  sectionLabel: string
  columnLabels: string[]
  row: string[]
  rowNumber: number
}) => {
  const output = [
    `Exact tabular match from ${documentLabel}`,
    sectionLabel,
    `Columns: ${columnLabels.join(" | ")}`,
    getRowReference(sectionLabel, rowNumber),
  ]

  row.forEach((value, index) => {
    if (!value) {
      return
    }
    output.push(`${columnLabels[index] || `Column ${index + 1}`}: ${value}`)
  })

  return output.join("\n")
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
  const sections: TabularSection[] = []

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
      values: rows,
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
    const [columns, ...rows] = section.values.filter(hasContent)
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

export const searchTabularRowsForExactMatches = ({
  filename,
  mimetype,
  buffer,
  query,
  maxMatches = DEFAULT_MAX_EXACT_MATCHES,
}: SearchTabularRowsForExactMatchesInput): TabularRowExactMatch[] => {
  if (!isTabularKnowledgeFile({ filename, mimetype })) {
    return []
  }

  const normalizedQuery = normalizeSearchValue(query)
  if (!normalizedQuery) {
    return []
  }

  const { documentLabel, sections } = getWorkbookSections({
    filename,
    mimetype,
    buffer,
  })
  const matches: TabularRowExactMatch[] = []

  for (const section of sections) {
    const [columns, ...rows] = section.values.filter(hasContent)
    if (!columns || rows.length === 0) {
      continue
    }

    const columnLabels = buildColumnLabels(columns)
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]
      if (!hasContent(row)) {
        continue
      }

      const hasExactMatch = row.some(
        (value, index) =>
          queryContainsExactCellValue(normalizedQuery, value) ||
          queryContainsColumnValue(
            normalizedQuery,
            columnLabels[index] || `Column ${index + 1}`,
            value
          )
      )
      if (!hasExactMatch) {
        continue
      }

      const matchedValues = row.filter(
        (value, index) =>
          queryContainsExactCellValue(normalizedQuery, value) ||
          queryContainsColumnValue(
            normalizedQuery,
            columnLabels[index] || `Column ${index + 1}`,
            value
          )
      )

      matches.push({
        chunkText: stringifyRowForRag({
          documentLabel,
          sectionLabel: section.label,
          columnLabels,
          row,
          rowNumber: rowIndex + 2,
        }),
        columnLabels,
        matchedValues,
        rowValues: row.filter(Boolean),
      })

      if (matches.length >= maxMatches) {
        return matches
      }
    }
  }

  return matches
}

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
