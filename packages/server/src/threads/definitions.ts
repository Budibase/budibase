import { Datasource, QuerySchema, Row } from "@budibase/types"

export type WorkerCallback = (error: any, response?: any) => void

export interface QueryEvent {
  appId?: string
  datasource: Datasource
  queryVerb: string
  fields: { [key: string]: any }
  parameters: { [key: string]: any }
  pagination?: any
  transformer: any
  queryId: string
  environmentVariables?: Record<string, string>
  ctx?: any
  schema?: Record<string, QuerySchema | string>
}

export interface QueryResponse {
  rows: Row[]
  keys: string[]
  info: any
  extra: any
  pagination: any
}

export interface QueryVariable {
  queryId: string
  name: string
}
