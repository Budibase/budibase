import { Table, TableSchema, View, ViewV2 } from "../../../documents"

interface ViewV2Response extends ViewV2 {
  schema: TableSchema
}

export type TableViewsResponse = { [key: string]: View | ViewV2Response }

export interface TableResponse extends Table {
  views?: TableViewsResponse
}

export type FetchTablesResponse = TableResponse[]
