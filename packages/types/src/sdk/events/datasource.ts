import { BaseEvent } from "./event"

export interface DatasourceCreatedEvent extends BaseEvent {
  datasourceId: string
  source: string
  custom: boolean
}

export interface DatasourceUpdatedEvent extends BaseEvent {
  datasourceId: string
  source: string
  custom: boolean
}

export interface DatasourceDeletedEvent extends BaseEvent {
  datasourceId: string
  source: string
  custom: boolean
}
