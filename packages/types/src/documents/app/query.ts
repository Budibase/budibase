import { Document } from "../document"

export interface QuerySchema {
  name?: string
  type: string
  subtype?: string
}

export interface Query extends Document {
  datasourceId: string
  name: string
  parameters: QueryParameter[]
  fields: RestQueryFields | any
  transformer: string | null
  schema: Record<string, QuerySchema | string>
  readable: boolean
  queryVerb: string
  // flag to state whether the default bindings are empty strings (old behaviour) or null
  nullDefaultSupport?: boolean
}

export interface QueryPreview extends Omit<Query, "_id"> {
  queryId?: string
}

export interface QueryParameter {
  name: string
  default: string
}

export interface QueryResponse {
  rows: any[]
  keys: string[]
  info: any
  extra: any
  pagination: any
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

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  HEAD = "HEAD",
  DELETE = "DELETE",
}
