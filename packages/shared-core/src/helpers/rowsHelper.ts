import { Row } from "@budibase/types"

/**
 * Converts an array of rows to a CSV string.
 * - Uses the provided columns to determine column order
 * - Escapes values appropriately for CSV format
 */
export function convertRowsToCsv(
  rows: Row[],
  columns: string[],
  delimiter = ","
): string {
  const headerLine = columns.join(delimiter)
  const dataLines = rows.map(row =>
    columns.map(h => escapeCsvValue(row[h], delimiter)).join(delimiter)
  )

  return [headerLine, ...dataLines].join("\n")
}

/**
 * Converts an array of rows to a JSON string with pretty-printing.
 */
export function convertRowsToJson(rows: Row[]): string {
  return JSON.stringify(rows, null, 2)
}

/**
 * Escapes a value for CSV export.
 * - Wraps the value in quotes
 * - Escapes any existing quotes by doubling them
 * - Converts null/undefined to empty string
 * - Converts objects to JSON strings
 */
export function escapeCsvValue(value: unknown, delimiter = ","): string {
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
 * Converts data rows to the specified export format (CSV or JSON).
 * - Builds normalized rows matching the schema keys
 * - Delegates to specific format converters
 */
export function convertDataToExportFormat(
  rows: Row[],
  format: "csv" | "json",
  columns?: { name: string }[],
  delimiter = ","
): string {
  const schemaKeys = columns?.length
    ? columns.map(c => c.name)
    : Array.from(new Set(rows.flatMap(row => Object.keys(row))))

  // Normalize rows to ensure every row has all schema keys
  const filteredRows = rows.map(row =>
    schemaKeys.reduce((acc: Row, key) => {
      acc[key] = key in row ? row[key] : ""
      return acc
    }, {})
  )

  switch (format) {
    case "csv":
      return convertRowsToCsv(filteredRows, schemaKeys, delimiter)
    case "json":
      return convertRowsToJson(filteredRows)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}
