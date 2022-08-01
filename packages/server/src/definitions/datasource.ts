import { Row, Table, Base } from "./common"

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
  FIRESTORE = "FIRESTORE",
  REDIS = "REDIS",
  SNOWFLAKE = "SNOWFLAKE",
}

export enum IncludeRelationships {
  INCLUDE = 1,
  EXCLUDE = 0,
}

export enum FilterTypes {
  STRING = "string",
  FUZZY = "fuzzy",
  RANGE = "range",
  EQUAL = "equal",
  NOT_EQUAL = "notEqual",
  EMPTY = "empty",
  NOT_EMPTY = "notEmpty",
  ONE_OF = "oneOf",
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
  auth?: { type: string }
  relationships?: boolean
  description: string
  friendlyName: string
  type?: string
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
  contains?: {
    [key: string]: any
  }
}

export interface SortJson {
  [key: string]: SortDirection
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
    renamed: RenameColumn
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

export interface QueryOptions {
  disableReturning?: boolean
}

export interface Datasource extends Base {
  type: string
  name: string
  source: SourceNames
  // the config is defined by the schema
  config: {
    [key: string]: string | number | boolean
  }
  plus: boolean
  entities?: {
    [key: string]: Table
  }
}

export enum AuthType {
  BASIC = "basic",
  BEARER = "bearer",
}

interface AuthConfig {
  _id: string
  name: string
  type: AuthType
  config: BasicAuthConfig | BearerAuthConfig
}

export interface BasicAuthConfig {
  username: string
  password: string
}

export interface BearerAuthConfig {
  token: string
}

export interface QueryParameter {
  name: string
  default: string
}

export interface RestQueryFields {
  path: string
  queryString?: string
  headers: { [key: string]: any }
  disabledHeaders: { [key: string]: any }
  requestBody: any
  bodyType: string
  json: object
  method: string
  authConfigId: string
  pagination: PaginationConfig | null
  paginationValues: PaginationValues | null
}

export interface RestConfig {
  url: string
  defaultHeaders: {
    [key: string]: any
  }
  authConfigs: AuthConfig[]
  staticVariables: {
    [key: string]: string
  }
  dynamicVariables: [
    {
      name: string
      queryId: string
      value: string
    }
  ]
}

export interface PaginationConfig {
  type: string
  location: string
  pageParam: string
  sizeParam: string | null
  responseParam: string | null
}

export interface PaginationValues {
  page: string | number | null
  limit: number | null
}

export interface Query {
  _id?: string
  datasourceId: string
  name: string
  parameters: QueryParameter[]
  fields: RestQueryFields | any
  transformer: string | null
  schema: any
  readable: boolean
  queryVerb: string
}
