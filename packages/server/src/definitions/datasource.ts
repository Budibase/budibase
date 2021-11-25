import { Row, Table } from "./common"

export enum Operation {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  BULK_CREATE = "BULK_CREATE",
  CREATE_TABLE = "CREATE_TABLE",
  UPDATE_TABLE = "UPDATE_TABLE",
  DELETE_TABLE = "DELETE_TABLE",
}

export enum SortDirection {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
}

export enum QueryTypes {
  SQL = "sql",
  JSON = "json",
  FIELDS = "fields",
}

export enum DatasourceFieldTypes {
  STRING = "string",
  LONGFORM = "longForm",
  BOOLEAN = "boolean",
  NUMBER = "number",
  PASSWORD = "password",
  LIST = "list",
  OBJECT = "object",
  JSON = "json",
  FILE = "file",
}

export enum SourceNames {
  POSTGRES = "POSTGRES",
  DYNAMODB = "DYNAMODB",
  MONGODB = "MONGODB",
  ELASTICSEARCH = "ELASTICSEARCH",
  COUCHDB = "COUCHDB",
  SQL_SERVER = "SQL_SERVER",
  S3 = "S3",
  AIRTABLE = "AIRTABLE",
  MYSQL = "MYSQL",
  ARANGODB = "ARANGODB",
  REST = "REST",
  ORACLE = "ORACLE",
  GOOGLE_SHEETS = "GOOGLE_SHEETS",
}

export enum IncludeRelationships {
  INCLUDE = 1,
  EXCLUDE = 0,
}

export interface QueryDefinition {
  type: QueryTypes
  displayName?: string
  readable?: boolean
  customisable?: boolean
  fields?: object
  urlDisplay?: boolean
}

export interface ExtraQueryConfig {
  [key: string]: {
    displayName: string
    type: string
    required: boolean
    data?: object
  }
}

export interface Integration {
  docs: string
  plus?: boolean
  description: string
  friendlyName: string
  datasource: {}
  query: {
    [key: string]: QueryDefinition
  }
  extra?: ExtraQueryConfig
}

export interface SearchFilters {
  allOr?: boolean
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
}

export interface SortJson {
  [key: string]: SortDirection
}

export interface PaginationJson {
  limit: number
  page?: string | number
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
  }
  resource: {
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
  }
  extra?: {
    idFilter?: SearchFilters
  }
  relationships?: RelationshipsJson[]
}

export interface SqlQuery {
  sql: string
  bindings?:
    | string[]
    | {
        [key: string]: any
      }
}

export interface QueryOptions {
  disableReturning?: boolean
}
