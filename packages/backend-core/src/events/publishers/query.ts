import { publishEvent } from "../events"
import {
  Event,
  Datasource,
  Query,
  QueryCreatedEvent,
  QueryUpdatedEvent,
  QueryDeletedEvent,
  QueryImportedEvent,
  QueryPreviewedEvent,
} from "@budibase/types"

/* eslint-disable */

export const created = (datasource: Datasource, query: Query) => {
  const properties: QueryCreatedEvent = {}
  publishEvent(Event.QUERY_CREATED, properties)
}

export const updated = (datasource: Datasource, query: Query) => {
  const properties: QueryUpdatedEvent = {}
  publishEvent(Event.QUERY_UPDATED, properties)
}

export const deleted = (datasource: Datasource, query: Query) => {
  const properties: QueryDeletedEvent = {}
  publishEvent(Event.QUERY_DELETED, properties)
}

export const imported = (
  datasource: Datasource,
  importSource: any,
  count: any
) => {
  const properties: QueryImportedEvent = {}
  publishEvent(Event.QUERY_IMPORT, properties)
}

// TODO
// exports.run = () => {
//   const properties = {}
//   events.processEvent(Events.QUERY_RUN, properties)
// }

export const previewed = (datasource: Datasource) => {
  const properties: QueryPreviewedEvent = {}
  publishEvent(Event.QUERY_PREVIEWED, properties)
}
