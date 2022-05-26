export interface DatasourceCreatedEvent {
  datasourceId: string
  source: string
}

export interface DatasourceUpdatedEvent {
  datasourceId: string
  source: string
}

export interface DatasourceDeletedEvent {
  datasourceId: string
  source: string
}
