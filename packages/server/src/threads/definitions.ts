import { Datasource, Row, Query } from "@budibase/types"

export type WorkerCallback = (error: any, response?: any) => void

export interface QueryEvent
  extends Omit<
    Query,
    "datasourceId" | "name" | "parameters" | "readable" | "nestedSchemaFields"
  > {
  appId?: string
  datasource: Datasource
  pagination?: any
  queryId?: string
  environmentVariables?: Record<string, string>
  parameters: QueryEventParameters
  ctx?: any
}

export type QueryEventParameters = Record<string, string | null>

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
