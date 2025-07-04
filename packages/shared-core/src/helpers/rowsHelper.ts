import { Row } from "@budibase/types"

export function cleanExportRows(
  rows: Row[],
  format: "csv" | "json",
  columns?: { name: string }[]
): string {
  const schemaKeys = columns?.length
    ? columns.map(c => c.name)
    : Array.from(new Set(rows.flatMap(row => Object.keys(row))))

  // Build filtered/normalized rows to match schema
  const filteredRows = rows.map(row =>
    schemaKeys.reduce((acc: Row, key) => {
      acc[key] = key in row ? row[key] : ""
      return acc
    }, {})
  )

  if (format === "csv") {
    return rowsToCsv(filteredRows, schemaKeys)
  } else if (format === "json") {
    return JSON.stringify(filteredRows, null, 2)
  }
  throw new Error(`Unsupported format: ${format}`)
}
/**
 * Escapes a value for CSV export.
 * - Wraps the value in quotes
 * - Escapes any existing quotes by doubling them
 * - Converts null/undefined to empty string
 * - Converts objects to JSON strings
 */
function escapeCsvValue(value: unknown, delimiter = ",") {
  if (value === null || value === undefined) return ""

  if (typeof value === "object") {
    // Always serialize the whole object as JSON if it's an object
    value = JSON.stringify(value)
  }

  let str = String(value)
  // Replace line breaks to keep value on one CSV line
  str = str.replace(/[\r\n]+/g, " ")

  const needsQuotes = str.includes(delimiter) || str.includes('"')
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
