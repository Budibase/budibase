import { Row, RowExportFormat, TableSchema } from "@budibase/types"

export { RowExportFormat as Format } from "@budibase/types"

function getHeaders(
  headers: string[],
  customHeaders: { [key: string]: string }
) {
  return headers.map(header => `"${customHeaders[header] || header}"`)
}

function escapeCsvString(str: string) {
  return str.replace(/"/g, '""')
}

export function csv(
  headers: string[],
  rows: Row[],
  delimiter = ",",
  customHeaders: { [key: string]: string } = {}
) {
  let csvRows = [getHeaders(headers, customHeaders)]

  for (let row of rows) {
    csvRows.push(
      headers.map(header => {
        const val = row[header]
        if (typeof val === "object" && !(val instanceof Date)) {
          return `"${JSON.stringify(val).replace(/"/g, "'")}"`
        }
        if (val !== undefined) {
          return `"${escapeCsvString(val.toString())}"`
        }
        return ""
      })
    )
  }
  return csvRows.map(row => row.join(delimiter)).join("\n")
}

export function json(rows: Row[]) {
  return JSON.stringify(rows, undefined, 2)
}

export function jsonWithSchema(schema: TableSchema, rows: Row[]) {
  const newSchema: TableSchema = {}
  Object.values(schema).forEach(column => {
    if (!column.autocolumn && column.name) {
      newSchema[column.name] = column
    }
  })
  return JSON.stringify({ schema: newSchema, rows }, undefined, 2)
}

export function isFormat(format: any): format is RowExportFormat {
  return Object.values(RowExportFormat).includes(format as RowExportFormat)
}
