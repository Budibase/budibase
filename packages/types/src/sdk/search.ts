import { Operation, SortDirection } from "./datasources"
import { Row, Table, DocumentType } from "../documents"
import { SortType } from "../api"
import { Knex } from "knex"

export enum SearchFilterOperator {
  STRING = "string",
  FUZZY = "fuzzy",
  RANGE = "range",
  EQUAL = "equal",
  NOT_EQUAL = "notEqual",
  EMPTY = "empty",
  NOT_EMPTY = "notEmpty",
  ONE_OF = "oneOf",
  CONTAINS = "contains",
  NOT_CONTAINS = "notContains",
  CONTAINS_ANY = "containsAny",
}

export interface SearchFilters {
  allOr?: boolean
  // TODO: this is just around for now - we need a better way to do or/and
  // allows just fuzzy to be or - all the fuzzy/like parameters
  fuzzyOr?: boolean
  onEmptyFilter?: EmptyFilterOption
  [SearchFilterOperator.STRING]?: {
    [key: string]: string
  }
  [SearchFilterOperator.FUZZY]?: {
    [key: string]: string
  }
  [SearchFilterOperator.RANGE]?: {
    [key: string]:
      | {
          high: number | string
          low: number | string
        }
      | { high: number | string }
      | { low: number | string }
  }
  [SearchFilterOperator.EQUAL]?: {
    [key: string]: any
  }
  [SearchFilterOperator.NOT_EQUAL]?: {
    [key: string]: any
  }
  [SearchFilterOperator.EMPTY]?: {
    [key: string]: any
  }
  [SearchFilterOperator.NOT_EMPTY]?: {
    [key: string]: any
  }
  [SearchFilterOperator.ONE_OF]?: {
    [key: string]: any[]
  }
  [SearchFilterOperator.CONTAINS]?: {
    [key: string]: any[]
  }
  [SearchFilterOperator.NOT_CONTAINS]?: {
    [key: string]: any[]
  }
  [SearchFilterOperator.CONTAINS_ANY]?: {
    [key: string]: any[]
  }
  // specific to SQS/SQLite search on internal tables this can be used
  // to make sure the documents returned are always filtered down to a
  // specific document type (such as just rows)
  documentType?: DocumentType
}

export type SearchFilterKey = keyof Omit<
  SearchFilters,
  "allOr" | "onEmptyFilter" | "fuzzyOr" | "documentType"
>

export type SearchQueryFields = Omit<SearchFilters, "allOr" | "onEmptyFilter">

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
  meta: {
    table: Table
    tables?: Record<string, Table>
    renamed?: RenameColumn
  }
  extra?: {
    idFilter?: SearchFilters
  }
  relationships?: RelationshipsJson[]
  tableAliases?: Record<string, string>
}

export interface QueryOptions {
  disableReturning?: boolean
  disableBindings?: boolean
}

export type SqlQueryBinding = Knex.Value[]

export interface SqlQuery {
  sql: string
  bindings?: SqlQueryBinding
}

export enum EmptyFilterOption {
  RETURN_ALL = "all",
  RETURN_NONE = "none",
}

export enum SqlClient {
  MS_SQL = "mssql",
  POSTGRES = "pg",
  MY_SQL = "mysql2",
  ORACLE = "oracledb",
  SQL_LITE = "sqlite3",
}
