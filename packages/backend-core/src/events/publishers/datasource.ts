import { publishEvent } from "../events"
import {
  Event,
  Datasource,
  DatasourceCreatedEvent,
  DatasourceUpdatedEvent,
  DatasourceDeletedEvent,
} from "@budibase/types"

export async function created(datasource: Datasource, timestamp?: string) {
  const properties: DatasourceCreatedEvent = {}
  await publishEvent(Event.DATASOURCE_CREATED, properties, timestamp)
}

export async function updated(datasource: Datasource) {
  const properties: DatasourceUpdatedEvent = {}
  await publishEvent(Event.DATASOURCE_UPDATED, properties)
}

export async function deleted(datasource: Datasource) {
  const properties: DatasourceDeletedEvent = {}
  await publishEvent(Event.DATASOURCE_DELETED, properties)
}
