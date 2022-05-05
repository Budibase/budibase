import { processEvent } from "../events"
import {
  Events,
  Datasource,
  DatasourceCreatedEvent,
  DatasourceUpdatedEvent,
  DatasourceDeletedEvent,
} from "@budibase/types"

export function created(datasource: Datasource) {
  const properties: DatasourceCreatedEvent = {}
  processEvent(Events.DATASOURCE_CREATED, properties)
}

export function updated(datasource: Datasource) {
  const properties: DatasourceUpdatedEvent = {}
  processEvent(Events.DATASOURCE_UPDATED, properties)
}

export function deleted(datasource: Datasource) {
  const properties: DatasourceDeletedEvent = {}
  processEvent(Events.DATASOURCE_DELETED, properties)
}
