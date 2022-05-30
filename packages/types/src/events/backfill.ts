export interface AppBackfillSucceededEvent {
  appId: string
  automations: number
  datasources: number
  layouts: number
  queries: number
  roles: number
  tables: number
  screens: number
  errors?: string[]
  errorCount?: number
}

export interface AppBackfillFailedEvent {
  error: string
}

export interface TenantBackfillSucceededEvent {
  apps: number
  users: number

  usage: any
  errors?: [string]
  errorCount?: number
}

export interface TenantBackfillFailedEvent {
  error: string
}

export interface InstallationBackfillSucceededEvent {}

export interface InstallationBackfillFailedEvent {
  error: string
}
