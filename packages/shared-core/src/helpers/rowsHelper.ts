import { Row } from "@budibase/types"

export function cleanExportRows(rows: Row[], format: "csv" | "json"): string {
  let cleanRows = [...rows]

  if (format === "csv") {
    // Build unified schema from all keys across all rows
    const schemaKeys = Array.from(
      new Set(cleanRows.flatMap(row => Object.keys(row)))
    )
    // Normalise each row to have all schema keys
    cleanRows = cleanRows.map(row => {
      const normalizedRow: Row = {}
      for (const key of schemaKeys) {
        normalizedRow[key] = key in row ? row[key] : ""
      }
      return normalizedRow
    })
    return rowsToCsv(cleanRows, schemaKeys)
  } else if (format === "json") {
    return JSON.stringify(cleanRows, null, 2) // no filtering, indented by 2 spaces
  } else {
    throw new Error(`Unsupported format: ${format}`)
  }
}

function rowsToCsv(rows: Row[], headers: string[]): string {
  const escape = (value: any) => {
    let strValue: string

    if (value === null || value === undefined) {
      strValue = ""
    } else if (typeof value === "object") {
      // Properly serialize objects and arrays
      strValue = JSON.stringify(value)
    } else {
      strValue = String(value)
    }

    return `"${strValue.replace(/"/g, '""')}"`
  }

  const csvLines = [
    headers.join(","),
    ...rows.map(row => headers.map(h => escape(row[h])).join(",")),
  ]

  return csvLines.join("\n")
}
