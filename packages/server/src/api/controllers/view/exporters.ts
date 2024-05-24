import { Row, TableSchema } from "@budibase/types"

function getHeaders(
  headers: string[],
  customHeaders: { [key: string]: string }
) {
  return headers.map(header => `"${customHeaders[header] || header}"`)
}

export function csv(
  headers: string[],
  rows: Row[],
  delimiter: string = ",",
  customHeaders: { [key: string]: string } = {}
) {
  let csv = getHeaders(headers, customHeaders).join(delimiter)

  for (let row of rows) {
    csv = `${csv}\n${headers
      .map(header => {
        let val = row[header]
        val =
          typeof val === "object" && !(val instanceof Date)
            ? `"${JSON.stringify(val).replace(/"/g, "'")}"`
            : val !== undefined
            ? `"${val}"`
            : ""
        return val.trim()
      })
      .join(delimiter)}`
  }
  return csv
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

export enum Format {
  CSV = "csv",
  JSON = "json",
  JSON_WITH_SCHEMA = "jsonWithSchema",
}

export function isFormat(format: any): format is Format {
  return Object.values(Format).includes(format as Format)
}

export function parseCsvExport<T>(value: string) {
  return JSON.parse(value) as T
}
