import { Operation } from "./datasources"
import { Row, DocumentType, Table, Datasource } from "../documents"
import { SortOrder, SortType } from "../api"
import { Knex } from "knex"
import { Aggregation } from "./row"

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
  return Object.values(LogicalOperator).includes(value as LogicalOperator)
}

export function isBasicSearchOperator(value: string): value is BasicOperator {
  return Object.values(BasicOperator).includes(value as BasicOperator)
}

export function isArraySearchOperator(value: string): value is ArrayOperator {
  return Object.values(ArrayOperator).includes(value as ArrayOperator)
}

export function isRangeSearchOperator(value: string): value is RangeOperator {
  return Object.values(RangeOperator).includes(value as RangeOperator)
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

export type ArrayFilter = Record<string, any[]> & {
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

type LogicalFilter = { conditions: SearchFilters[] }

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

  [LogicalOperator.AND]?: LogicalFilter
  [LogicalOperator.OR]?: LogicalFilter
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
    datasourceId: string | Datasource
    entityId: string | Table
    operation: Operation
    schema?: string
  }
  resource?: {
    fields: string[]
    aggregations?: Aggregation[]
  }
  filters?: SearchFilters
  sort?: SortJson
  paginate?: PaginationJson
  body?: Row | Row[]
  meta?: {
    renamed?: RenameColumn
    oldTable?: Table
    // can specify something that columns could be prefixed with
    columnPrefix?: string
  }
  extra?: {
    idFilter?: SearchFilters
  }
  relationships?: RelationshipsJson[]
  tableAliases?: Record<string, string>
}

export interface EnrichedQueryJson extends Omit<QueryJson, "endpoint"> {
  operation: Operation
  table: Table
  tables: Record<string, Table>
  datasource?: Datasource
  schema?: string
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

export enum UILogicalOperator {
  ALL = "all",
  ANY = "any",
}

export enum SqlClient {
  MS_SQL = "mssql",
  POSTGRES = "pg",
  MY_SQL = "mysql2",
  MARIADB = "mariadb",
  ORACLE = "oracledb",
  SQL_LITE = "sqlite3",
}
