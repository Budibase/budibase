import { publishEvent } from "../events"
import {
  Event,
  Datasource,
  DatasourceCreatedEvent,
  DatasourceUpdatedEvent,
  DatasourceDeletedEvent,
} from "@budibase/types"

export function created(datasource: Datasource) {
  const properties: DatasourceCreatedEvent = {}
  publishEvent(Event.DATASOURCE_CREATED, properties)
}

export function updated(datasource: Datasource) {
  const properties: DatasourceUpdatedEvent = {}
  publishEvent(Event.DATASOURCE_UPDATED, properties)
}

export function deleted(datasource: Datasource) {
  const properties: DatasourceDeletedEvent = {}
  publishEvent(Event.DATASOURCE_DELETED, properties)
}
