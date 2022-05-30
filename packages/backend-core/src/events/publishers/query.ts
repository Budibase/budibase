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
  QueriesRunEvent,
} from "@budibase/types"

/* eslint-disable */

export const created = async (
  datasource: Datasource,
  query: Query,
  timestamp?: string
) => {
  const properties: QueryCreatedEvent = {}
  await publishEvent(Event.QUERY_CREATED, properties, timestamp)
}

export const updated = async (datasource: Datasource, query: Query) => {
  const properties: QueryUpdatedEvent = {}
  await publishEvent(Event.QUERY_UPDATED, properties)
}

export const deleted = async (datasource: Datasource, query: Query) => {
  const properties: QueryDeletedEvent = {}
  await publishEvent(Event.QUERY_DELETED, properties)
}

export const imported = async (
  datasource: Datasource,
  importSource: any,
  count: any
) => {
  const properties: QueryImportedEvent = {}
  await publishEvent(Event.QUERY_IMPORT, properties)
}

export const run = async (count: number, timestamp?: string | number) => {
  const properties: QueriesRunEvent = {
    count,
  }
  await publishEvent(Event.QUERIES_RUN, properties, timestamp)
}

export const previewed = async (datasource: Datasource) => {
  const properties: QueryPreviewedEvent = {}
  await publishEvent(Event.QUERY_PREVIEWED, properties)
}
