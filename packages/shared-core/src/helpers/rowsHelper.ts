import { Row } from "@budibase/types"

export function cleanExportRows(rows: Row[], format: "csv" | "json"): string {
  if (format === "csv") {
    // Build unified schema from all keys across all rows
    const schemaKeys = Array.from(
      new Set(rows.flatMap(row => Object.keys(row)))
    )

    // Normalize rows with schema
    const normalizedRows = rows.map(row => {
      const normalizedRow: Row = {}
      for (const key of schemaKeys) {
        normalizedRow[key] = key in row ? row[key] : ""
      }
      return normalizedRow
    })

    return rowsToCsv(normalizedRows, schemaKeys)
  } else if (format === "json") {
    return JSON.stringify(rows, null, 2) // indented by 2 spaces
  } else {
    throw new Error(`Unsupported format: ${format}`)
  }
}

const escapeCsvValue = (value: any): string => {
  let strValue: string

  if (value == null) {
    strValue = ""
  } else if (typeof value === "object") {
    strValue = JSON.stringify(value)
  } else {
    strValue = String(value)
  }

  return `"${strValue.replace(/"/g, '""')}"`
}

function rowsToCsv(rows: Row[], headers: string[]): string {
  const headerLine = headers.join(",")
  const dataLines = rows.map(row =>
    headers.map(h => escapeCsvValue(row[h])).join(",")
  )

  return [headerLine, ...dataLines].join("\n")
}
