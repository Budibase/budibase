import { Row } from "@budibase/types"

export function cleanExportRows(
  rows: Row[],
  format: "csv" | "json",
  columns?: { name: string }[]
): string {
  let filteredRows: Row[] = rows
  let schemaKeys: string[]

  if (columns && columns.length > 0) {
    // Build schema from provided column names
    schemaKeys = columns.map(c => c.name)

    // Filter rows to contain only keys in schema
    filteredRows = rows.map(row => {
      const filteredRow: Row = {}
      for (const key of schemaKeys) {
        filteredRow[key] = key in row ? row[key] : ""
      }
      return filteredRow
    })
  } else {
    // Build unified schema from all keys across all rows
    schemaKeys = Array.from(new Set(rows.flatMap(row => Object.keys(row))))

    // Normalize rows to ensure all have the same keys
    filteredRows = rows.map(row => {
      const normalizedRow: Row = {}
      for (const key of schemaKeys) {
        normalizedRow[key] = key in row ? row[key] : ""
      }
      return normalizedRow
    })
  }

  if (format === "csv") {
    return rowsToCsv(filteredRows, schemaKeys)
  } else if (format === "json") {
    return JSON.stringify(filteredRows, null, 2) // indented by 2 spaces
  } else {
    throw new Error(`Unsupported format: ${format}`)
  }
}
/**
 * Escapes a value for CSV export.
 * - Wraps the value in quotes
 * - Escapes any existing quotes by doubling them
 * - Converts null/undefined to empty string
 * - Converts objects to JSON strings
 */
function escapeCsvValue(value, delimiter = ",") {
  if (value === null || value === undefined) return ""

  if (typeof value === "object") {
    if ("primaryDisplay" in value)
      return escapeCsvValue(value.primaryDisplay, delimiter)

    return escapeCsvValue(JSON.stringify(value), delimiter)
  }

  let str = String(value)

  str = str.replace(/[\r\n]+/g, " ")

  const needsQuotes =
    str.includes(delimiter) || str.includes('"') || str.includes(",")
  if (needsQuotes) {
    str = str.replace(/"/g, '""')
    return `"${str}"`
  }
  return str
}

/**
 * Converts an array of rows to a CSV string.
 * - Uses the provided headers to determine column order
 * - Escapes values appropriately for CSV format
 */
function rowsToCsv(rows: Row[], headers: string[]): string {
  const headerLine = headers.join(",")
  const dataLines = rows.map(row =>
    headers.map(h => escapeCsvValue(row[h])).join(",")
  )

  return [headerLine, ...dataLines].join("\n")
}
