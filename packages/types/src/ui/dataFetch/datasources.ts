import { InternalTable, Row, TableSchema } from "../../documents"

export type DataFetchDatasource =
  | TableDatasource
  | ViewV1Datasource
  | ViewDatasource
  | QueryDatasource
  | RelationshipDatasource
  | UserDatasource
  | GroupUserDatasource
  | CustomDatasource
  | NestedProviderDatasource
  | FieldDatasource
  | QueryArrayFieldDatasource
  | JSONArrayFieldDatasource

export interface TableDatasource {
  type: "table"
  tableId: string
}

export type ViewV1Datasource = {
  type: "view"
  name: string
  tableId: string
  calculation: string
  field: string
  groupBy: string
}

export interface ViewDatasource {
  type: "viewV2"
  id: string
}

export interface QueryDatasource {
  type: "query"
  _id: string
  fields: Record<string, any> & {
    pagination?: {
      type: string
      location: string
      pageParam: string
    }
  }
  queryParams?: Record<string, string>
  parameters: { name: string; default: string }[]
}

export interface RelationshipDatasource {
  type: "link"
  tableId: string
  rowId: string
  rowTableId: string
  fieldName: string
}

export interface UserDatasource {
  type: "user"
  tableId: InternalTable.USER_METADATA
}

export interface GroupUserDatasource {
  type: "groupUser"
  tableId: InternalTable.USER_METADATA
}

export interface CustomDatasource {
  type: "custom"
  data: any
}

export interface NestedProviderDatasource {
  type: "provider"
  value?: {
    schema: TableSchema
    primaryDisplay: string
    rows: Row[]
  }
}

interface BaseFieldDatasource<
  TType extends "field" | "queryarray" | "jsonarray"
> {
  type: TType
  tableId: string
  fieldType: "attachment" | "array"
  value: string[] | Row[]
}

export type FieldDatasource = BaseFieldDatasource<"field">
export type QueryArrayFieldDatasource = BaseFieldDatasource<"queryarray">
export type JSONArrayFieldDatasource = BaseFieldDatasource<"jsonarray">
