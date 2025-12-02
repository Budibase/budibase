import {
  Datasource,
  Query,
  QueryPreview,
  QuerySchema,
  QueryVerb,
} from "../../../documents"

export type FetchQueriesResponse = Query[]

export interface SaveQueryRequest extends Query {}
export interface SaveQueryResponse extends Query {}

export interface ImportRestQueryRequest {
  datasourceId?: string
  data?: string
  url?: string
  datasource: Datasource
  selectedEndpointId?: string
}

export interface QueryImportEndpoint {
  id: string
  name: string
  method?: string
  path?: string
  description?: string
  queryVerb?: QueryVerb
}

export interface ImportRestQueryInfoRequest {
  data?: string
  url?: string
}

export interface ImportRestQueryInfoResponse {
  name: string
  url?: string
  docsUrl?: string
  endpoints: QueryImportEndpoint[]
}
export interface ImportRestQueryResponse {
  errorQueries: Query[]
  queries: Query[]
  datasourceId: string
}

export interface FindQueryResponse extends Query {}

export interface PreviewQueryRequest extends QueryPreview {}

export interface PreviewQueryResponse {
  rows: any[]
  nestedSchemaFields: { [key: string]: { [key: string]: string | QuerySchema } }
  schema: { [key: string]: string | QuerySchema }
  info: any
  extra: any
}

export interface ExecuteQueryRequest {
  parameters?: Record<string, string | number | null>
  pagination?: any
}
export type ExecuteV1QueryResponse = Record<string, any>[]
export interface ExecuteV2QueryResponse {
  data: Record<string, any>[]
  pagination?: {
    page: number
    cursor: string
  }
}

export interface DeleteQueryResponse {
  message: string
}
