import { BaseEvent } from "./event"

export interface QueryCreatedEvent extends BaseEvent {
  queryId: string
  datasourceId: string
  source: string
  queryVerb: string
}

export interface QueryUpdatedEvent extends BaseEvent {
  queryId: string
  datasourceId: string
  source: string
  queryVerb: string
}

export interface QueryDeletedEvent extends BaseEvent {
  queryId: string
  datasourceId: string
  source: string
  queryVerb: string
}

export interface QueryImportedEvent extends BaseEvent {
  datasourceId: string
  source: string
  count: number
  importSource: string
}

export interface QueryPreviewedEvent extends BaseEvent {
  queryId?: string
  datasourceId: string
  source: string
  queryVerb: string
}

export interface QueriesRunEvent extends BaseEvent {
  count: number
}
