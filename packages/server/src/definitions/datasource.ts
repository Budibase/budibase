import { Row, Table, Base } from "./common"
import {
  Operation,
  QueryTypes,
  SortDirection,
  SourceNames,
} from "@budibase/types"

// these were previously exported here - moved to types for re-use
export {
  Operation,
  SortDirection,
  QueryTypes,
  DatasourceFieldTypes,
  SourceNames,
  IncludeRelationships,
  FilterTypes,
} from "@budibase/types"

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
