import {
  FieldSchema,
  Row,
  Table,
  TableRequest,
  TableSchema,
  View,
  ViewV2,
} from "../../../documents"

interface ViewV2Response extends ViewV2 {
  schema: TableSchema
}

export type TableViewsResponse = { [key: string]: View | ViewV2Response }

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
  tableId: string
  oldColumn: FieldSchema
  newColumn: FieldSchema
}

export interface MigrateResponse {
  message: string
}
