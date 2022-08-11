import { SortDirection, Operation, SourceNames } from "@budibase/types"
// export everything that used to be exported from here
export {
  Operation,
  SortDirection,
  QueryTypes,
  DatasourceFieldTypes,
  SourceNames,
  IncludeRelationships,
  FilterTypes,
  QueryDefinition,
  ExtraQueryConfig,
  Integration,
  IntegrationBase,
  QueryParameter,
  PaginationConfig,
  PaginationValues,
  RestQueryFields,
  Query,
  Datasource,
  SearchFilters,
  SortJson,
  PaginationJson,
  RenameColumn,
  RelationshipsJson,
  QueryJson,
  SqlQuery,
} from "@budibase/types"

/********************************************
 * This file contains structures which are  *
 * internal to the server and don't need to *
 * be exposed for use by other services.    *
 ********************************************/

export interface QueryOptions {
  disableReturning?: boolean
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
