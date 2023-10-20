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
  schema?: Record<string, { name?: string; type: string }>
}

export interface QueryVariable {
  queryId: string
  name: string
}
