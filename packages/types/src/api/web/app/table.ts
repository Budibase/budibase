import {
  FieldSchema,
  Row,
  Table,
  TableRequest,
  View,
  ViewV2Enriched,
} from "../../../documents"

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
