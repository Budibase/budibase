import { Row } from "@budibase/types"

export function csv(headers: string[], rows: Row[]) {
  let csv = headers.map(key => `"${key}"`).join(",")

  for (let row of rows) {
    csv = `${csv}\n${headers
      .map(header => {
        let val = row[header]
        val =
          typeof val === "object" && !(val instanceof Date)
            ? `"${JSON.stringify(val).replace(/"/g, "'")}"`
            : `"${val}"`
        return val.trim()
      })
      .join(",")}`
  }
  return csv
}

export function json(headers: string[], rows: Row[]) {
  return JSON.stringify(rows, undefined, 2)
}

export const ExportFormats = {
  CSV: "csv",
  JSON: "json",
}
