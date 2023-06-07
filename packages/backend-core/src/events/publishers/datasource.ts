import { publishEvent } from "../events"
import {
  Event,
  Datasource,
  DatasourceCreatedEvent,
  DatasourceUpdatedEvent,
  DatasourceDeletedEvent,
  SourceName,
} from "@budibase/types"

function isCustom(datasource: Datasource) {
  const sources = Object.values(SourceName)
  // if not in the base source list, then it must be custom
  return !sources.includes(datasource.source)
}

async function created(datasource: Datasource, timestamp?: string | number) {
  const properties: DatasourceCreatedEvent = {
    datasourceId: datasource._id as string,
    source: datasource.source,
    custom: isCustom(datasource),
  }
  await publishEvent(Event.DATASOURCE_CREATED, properties, timestamp)
}

async function updated(datasource: Datasource) {
  const properties: DatasourceUpdatedEvent = {
    datasourceId: datasource._id as string,
    source: datasource.source,
    custom: isCustom(datasource),
  }
  await publishEvent(Event.DATASOURCE_UPDATED, properties)
}

async function deleted(datasource: Datasource) {
  const properties: DatasourceDeletedEvent = {
    datasourceId: datasource._id as string,
    source: datasource.source,
    custom: isCustom(datasource),
  }
  await publishEvent(Event.DATASOURCE_DELETED, properties)
}

export default {
  created,
  updated,
  deleted,
}
