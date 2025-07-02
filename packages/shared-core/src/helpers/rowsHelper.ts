import { Row } from "@budibase/types"

export function cleanExportRows(
  rows: Row[],
  format: "csv" | "json",
  customHeaders?: { [key: string]: string }
): Row[] {
  let cleanRows = [...rows]

  if (format === "csv") {
    // Build unified schema from all keys across all rows
    const schemaKeys = Array.from(
      new Set(cleanRows.flatMap(row => Object.keys(row)))
    )

    // Normalize each row to have all schema keys
    cleanRows = cleanRows.map(row => {
      const normalizedRow: Row = {}
      for (const key of schemaKeys) {
        normalizedRow[key] = key in row ? row[key] : ""
      }
      return normalizedRow
    })
  } else if (format === "json" && customHeaders) {
    // Rename keys using customHeaders map
    cleanRows = cleanRows.map(row => renameKeys(customHeaders, row))
  }

  return cleanRows
}

function renameKeys(keysMap: { [key: string]: string }, row: any): any {
  const renamedRow: any = { ...row }
  for (const key in keysMap) {
    if (key in row) {
      renamedRow[keysMap[key]] = renamedRow[key]
      delete renamedRow[key]
    }
  }
  return renamedRow
}
