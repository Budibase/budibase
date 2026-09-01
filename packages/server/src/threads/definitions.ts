import {
  Datasource,
  Row,
  Query,
  ContextUser,
  RestPreviewConfig,
  SSOUser,
  UserBindings,
} from "@budibase/types"

export type WorkerCallback = (error: any, response?: any) => void

export interface QueryEventCtx {
  user?: Omit<ContextUser, "account" | "license"> | SSOUser | UserBindings
  auth?: {
    configId?: string
    sessionId?: string
  }
}

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
  ctx?: QueryEventCtx
  // Set only by the query preview path, which is builder authenticated. Never
  // set on execution, so the request preview cannot reach an app end user.
  includeRequest?: boolean
  previewConfig?: RestPreviewConfig
}

export type QueryEventParameters = Record<string, string | number | null>

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
