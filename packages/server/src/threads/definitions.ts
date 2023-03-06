import { EnvironmentVariablesDecrypted } from "@budibase/types"

export type WorkerCallback = (error: any, response?: any) => void

export interface QueryEvent {
  appId?: string
  datasource: any
  queryVerb: string
  fields: { [key: string]: any }
  parameters: { [key: string]: any }
  pagination?: any
  transformer: any
  queryId: string
  environmentVariables?: Record<string, string>
  ctx?: any
}

export interface QueryVariable {
  queryId: string
  name: string
}
