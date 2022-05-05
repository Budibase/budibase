import { processEvent } from "../events"
import {
  Event,
  Datasource,
  DatasourceCreatedEvent,
  DatasourceUpdatedEvent,
  DatasourceDeletedEvent,
} from "@budibase/types"

export function created(datasource: Datasource) {
  const properties: DatasourceCreatedEvent = {}
  processEvent(Event.DATASOURCE_CREATED, properties)
}

export function updated(datasource: Datasource) {
  const properties: DatasourceUpdatedEvent = {}
  processEvent(Event.DATASOURCE_UPDATED, properties)
}

export function deleted(datasource: Datasource) {
  const properties: DatasourceDeletedEvent = {}
  processEvent(Event.DATASOURCE_DELETED, properties)
}
