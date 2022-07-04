import { BaseEvent } from "./event"

export interface DatasourceCreatedEvent extends BaseEvent {
  datasourceId: string
  source: string
}

export interface DatasourceUpdatedEvent extends BaseEvent {
  datasourceId: string
  source: string
}

export interface DatasourceDeletedEvent extends BaseEvent {
  datasourceId: string
  source: string
}
