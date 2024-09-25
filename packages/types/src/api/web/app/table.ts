import { Row, Table, TableRequest, TableSchema, View } from "../../../documents"
import { ViewV2Enriched } from "../../../sdk"

export type TableViewsResponse = { [key: string]: View | ViewV2Enriched }

export interface TableResponse extends Table {
  views?: TableViewsResponse
}

export type FetchTablesResponse = TableResponse[]

export interface SaveTableRequest extends TableRequest {
  rows?: Row[]
}

export type SaveTableResponse = Table

export interface BulkImportRequest {
  rows: Row[]
  identifierFields?: Array<string>
}

export interface BulkImportResponse {
  message: string
}

export interface MigrateRequest {
  oldColumn: string
  newColumn: string
}

export interface MigrateResponse {
  message: string
}

export interface ValidateNewTableImportRequest {
  rows: Row[]
  schema: TableSchema
}

export interface ValidateTableImportRequest {
  tableId?: string
  rows: Row[]
}

export interface ValidateTableImportResponse {
  schemaValidation: {
    [field: string]: boolean
  }
  allValid: boolean
  invalidColumns: Array<string>
  errors: Record<string, string>
}

export interface CsvToJsonRequest {
  csvString: string
}

export type CsvToJsonResponse = any[]
