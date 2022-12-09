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
  timestamp?: string | number
) => {
  const properties: QueryCreatedEvent = {
    queryId: query._id as string,
    datasourceId: datasource._id as string,
    source: datasource.source,
    queryVerb: query.queryVerb,
  }
  await publishEvent(Event.QUERY_CREATED, properties, timestamp)
}

export const updated = async (datasource: Datasource, query: Query) => {
  const properties: QueryUpdatedEvent = {
    queryId: query._id as string,
    datasourceId: datasource._id as string,
    source: datasource.source,
    queryVerb: query.queryVerb,
  }
  await publishEvent(Event.QUERY_UPDATED, properties)
}

export const deleted = async (datasource: Datasource, query: Query) => {
  const properties: QueryDeletedEvent = {
    queryId: query._id as string,
    datasourceId: datasource._id as string,
    source: datasource.source,
    queryVerb: query.queryVerb,
  }
  await publishEvent(Event.QUERY_DELETED, properties)
}

export const imported = async (
  datasource: Datasource,
  importSource: any,
  count: any
) => {
  const properties: QueryImportedEvent = {
    datasourceId: datasource._id as string,
    source: datasource.source,
    count,
    importSource,
  }
  await publishEvent(Event.QUERY_IMPORT, properties)
}

export const run = async (count: number, timestamp?: string | number) => {
  const properties: QueriesRunEvent = {
    count,
  }
  await publishEvent(Event.QUERIES_RUN, properties, timestamp)
}

export const previewed = async (datasource: Datasource, query: Query) => {
  const properties: QueryPreviewedEvent = {
    queryId: query._id,
    datasourceId: datasource._id as string,
    source: datasource.source,
    queryVerb: query.queryVerb,
  }
  await publishEvent(Event.QUERY_PREVIEWED, properties)
}
