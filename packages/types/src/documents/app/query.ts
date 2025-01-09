import { Document } from "../document"
import { Row } from "./row"

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
  nestedSchemaFields?: Record<string, Record<string, QuerySchema | string>>
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
  rows: Row[]
  keys: string[]
  info: any
  extra: any
  pagination: any
}

export enum BodyType {
  NONE = "none",
  FORM_DATA = "form",
  XML = "xml",
  ENCODED = "encoded",
  JSON = "json",
  TEXT = "text",
}

export interface RestQueryFields {
  path?: string
  queryString?: string
  headers?: { [key: string]: any }
  disabledHeaders?: { [key: string]: any }
  requestBody?: any
  bodyType?: BodyType
  method?: string
  authConfigId?: string
  pagination?: PaginationConfig
  paginationValues?: PaginationValues
}

export interface PaginationConfig {
  type: string
  location: string
  pageParam: string
  sizeParam?: string
  responseParam?: string
}

export interface PaginationValues {
  page?: string | number
  limit?: number
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  HEAD = "HEAD",
  DELETE = "DELETE",
}
