import { Operation, SortDirection } from "./datasources"
import { Row, Table } from "../documents"
import { SortType } from "../api"

export interface SearchFilters {
  allOr?: boolean
  onEmptyFilter?: EmptyFilterOption
  string?: {
    [key: string]: string
  }
  fuzzy?: {
    [key: string]: string
  }
  range?: {
    [key: string]: {
      high: number | string
      low: number | string
    }
  }
  equal?: {
    [key: string]: any
  }
  notEqual?: {
    [key: string]: any
  }
  empty?: {
    [key: string]: any
  }
  notEmpty?: {
    [key: string]: any
  }
  oneOf?: {
    [key: string]: any[]
  }
  contains?: {
    [key: string]: any[] | any
  }
  notContains?: {
    [key: string]: any[]
  }
  containsAny?: {
    [key: string]: any[]
  }
}

export interface SortJson {
  [key: string]: {
    direction: SortDirection
    type?: SortType
  }
}

export interface PaginationJson {
  limit: number
  page?: string | number
}

export interface RenameColumn {
  old: string
  updated: string
}

export interface RelationshipsJson {
  through?: string
  from?: string
  to?: string
  fromPrimary?: string
  toPrimary?: string
  tableName: string
  column: string
}

export interface QueryJson {
  endpoint: {
    datasourceId: string
    entityId: string
    operation: Operation
    schema?: string
  }
  resource?: {
    fields: string[]
  }
  filters?: SearchFilters
  sort?: SortJson
  paginate?: PaginationJson
  body?: Row | Row[]
  table?: Table
  meta?: {
    table?: Table
    tables?: Record<string, Table>
    renamed?: RenameColumn
  }
  extra?: {
    idFilter?: SearchFilters
  }
  relationships?: RelationshipsJson[]
}

export interface SqlQuery {
  sql: string
  bindings?: string[]
}

export enum EmptyFilterOption {
  RETURN_ALL = "all",
  RETURN_NONE = "none",
}
