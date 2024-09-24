import { Operation } from "./datasources"
import { Row, Table, DocumentType } from "../documents"
import { SortOrder, SortType } from "../api"
import { Knex } from "knex"

export enum BasicOperator {
  EQUAL = "equal",
  NOT_EQUAL = "notEqual",
  EMPTY = "empty",
  NOT_EMPTY = "notEmpty",
  FUZZY = "fuzzy",
  STRING = "string",
}

export enum ArrayOperator {
  CONTAINS = "contains",
  NOT_CONTAINS = "notContains",
  CONTAINS_ANY = "containsAny",
  ONE_OF = "oneOf",
}

export enum RangeOperator {
  RANGE = "range",
}

export enum LogicalOperator {
  AND = "$and",
  OR = "$or",
}

export function isLogicalSearchOperator(
  value: string
): value is LogicalOperator {
  return value === LogicalOperator.AND || value === LogicalOperator.OR
}

export type SearchFilterOperator =
  | BasicOperator
  | ArrayOperator
  | RangeOperator
  | LogicalOperator

export enum InternalSearchFilterOperator {
  COMPLEX_ID_OPERATOR = "_complexIdOperator",
}

type BasicFilter<T = any> = Record<string, T> & {
  [InternalSearchFilterOperator.COMPLEX_ID_OPERATOR]?: never
}

type ArrayFilter = Record<string, any[]> & {
  [InternalSearchFilterOperator.COMPLEX_ID_OPERATOR]?: {
    id: string[]
    values: string[]
  }
}

type RangeFilter = Record<
  string,
  | {
      high: number | string
      low: number | string
    }
  | { high: number | string }
  | { low: number | string }
> & {
  [InternalSearchFilterOperator.COMPLEX_ID_OPERATOR]?: never
}

export type AnySearchFilter = BasicFilter | ArrayFilter | RangeFilter

export interface SearchFilters {
  allOr?: boolean
  // TODO: this is just around for now - we need a better way to do or/and
  // allows just fuzzy to be or - all the fuzzy/like parameters
  fuzzyOr?: boolean
  onEmptyFilter?: EmptyFilterOption
  [BasicOperator.STRING]?: BasicFilter<string>
  [BasicOperator.FUZZY]?: BasicFilter<string>
  [RangeOperator.RANGE]?: RangeFilter
  [BasicOperator.EQUAL]?: BasicFilter
  [BasicOperator.NOT_EQUAL]?: BasicFilter
  [BasicOperator.EMPTY]?: BasicFilter
  [BasicOperator.NOT_EMPTY]?: BasicFilter
  [ArrayOperator.ONE_OF]?: ArrayFilter
  [ArrayOperator.CONTAINS]?: ArrayFilter
  [ArrayOperator.NOT_CONTAINS]?: ArrayFilter
  [ArrayOperator.CONTAINS_ANY]?: ArrayFilter
  // specific to SQS/SQLite search on internal tables this can be used
  // to make sure the documents returned are always filtered down to a
  // specific document type (such as just rows)
  documentType?: DocumentType

  [LogicalOperator.AND]?: {
    conditions: SearchFilters[]
  }
  [LogicalOperator.OR]?: {
    conditions: SearchFilters[]
  }
}

export type SearchFilterKey = keyof Omit<
  SearchFilters,
  "allOr" | "onEmptyFilter" | "fuzzyOr" | "documentType"
>

export type SearchQueryFields = Omit<SearchFilters, "allOr" | "onEmptyFilter">

export interface SortJson {
  [key: string]: {
    direction: SortOrder
    type?: SortType
  }
}

export interface PaginationJson {
  limit: number
  page?: string | number
  offset?: number
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

// TODO - this can be combined with the above type
export interface ManyToManyRelationshipJson {
  through: string
  from: string
  to: string
  fromPrimary: string
  toPrimary: string
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
    // can specify something that columns could be prefixed with
    columnPrefix?: string
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
  MARIADB = "mariadb",
  ORACLE = "oracledb",
  SQL_LITE = "sqlite3",
}
