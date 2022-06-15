import { BaseEvent, Event } from "./event"

export interface AppBackfillSucceededEvent extends BaseEvent {
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

export interface AppBackfillFailedEvent extends BaseEvent {
  error: string
}

export interface TenantBackfillSucceededEvent extends BaseEvent {
  apps: number
  users: number

  usage: any
  errors?: [string]
  errorCount?: number
}

export interface TenantBackfillFailedEvent extends BaseEvent {
  error: string
}

export interface InstallationBackfillSucceededEvent extends BaseEvent {}

export interface InstallationBackfillFailedEvent extends BaseEvent {
  error: string
}

export interface BackfillMetadata extends BaseEvent {
  eventWhitelist: Event[]
}

export interface CachedEvent extends BaseEvent {
  event: Event
  properties: any
}
