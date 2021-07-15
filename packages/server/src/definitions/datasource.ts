export enum Operation {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
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
  BOOLEAN = "boolean",
  NUMBER = "number",
  PASSWORD = "password",
  LIST = "list",
  OBJECT = "object",
  JSON = "json",
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
}

export interface QueryDefinition {
  type: QueryTypes
  displayName?: string
  readable?: boolean
  customisable?: boolean
  fields?: object
  urlDisplay?: boolean
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
  page: string | number
}

export interface RelationshipsJson {
  through?: string
  from?: string
  to?: string
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
  body?: object
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
