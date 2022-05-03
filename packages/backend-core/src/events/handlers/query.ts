import { processEvent } from "../events"
import {
  Events,
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
  processEvent(Events.QUERY_CREATED, properties)
}

export const updated = (datasource: Datasource, query: Query) => {
  const properties: QueryUpdatedEvent = {}
  processEvent(Events.QUERY_UPDATED, properties)
}

export const deleted = (datasource: Datasource, query: Query) => {
  const properties: QueryDeletedEvent = {}
  processEvent(Events.QUERY_DELETED, properties)
}

export const imported = (
  datasource: Datasource,
  importSource: any,
  count: any
) => {
  const properties: QueryImportedEvent = {}
  processEvent(Events.QUERY_IMPORT, properties)
}

// TODO
// exports.run = () => {
//   const properties = {}
//   events.processEvent(Events.QUERY_RUN, properties)
// }

export const previewed = (datasource: Datasource) => {
  const properties: QueryPreviewedEvent = {}
  processEvent(Events.QUERY_PREVIEWED, properties)
}
