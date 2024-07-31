import { Row, RowExportFormat, TableSchema } from "@budibase/types"
import * as csvUtils from "../../../utilities/csv"

export { RowExportFormat as Format } from "@budibase/types"

export const csv = csvUtils.csv

export const parseCsvExport = csvUtils.jsonFromCsvString

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
