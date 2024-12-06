import { publishEvent } from "../events"
import {
  Event,
  ViewCalculationCreatedEvent,
  ViewCalculationDeletedEvent,
  ViewCalculationUpdatedEvent,
  ViewCreatedEvent,
  ViewDeletedEvent,
  ViewExportedEvent,
  ViewFilterCreatedEvent,
  ViewFilterDeletedEvent,
  ViewFilterUpdatedEvent,
  ViewUpdatedEvent,
  View,
  ViewV2,
  ViewCalculation,
  Table,
  TableExportFormat,
} from "@budibase/types"

/* eslint-disable */

async function created(view: ViewV2, timestamp?: string | number) {
  const properties: ViewCreatedEvent = {
    name: view.name,
    type: view.type,
    tableId: view.tableId,
  }
  await publishEvent(Event.VIEW_CREATED, properties, timestamp)
}

async function updated(newView: ViewV2) {
  let viewJoins = 0
  for (const key in newView.schema) {
    if (newView.schema[key]?.columns) {
      viewJoins += Object.keys(newView.schema[key]?.columns).length
    }
  }
  const properties: ViewUpdatedEvent = {
    tableId: newView.tableId,
    groupedFilters: newView.queryUI?.groups?.length || 0,
    viewJoins,
  }
  await publishEvent(Event.VIEW_UPDATED, properties)
}

async function deleted(view: View) {
  const properties: ViewDeletedEvent = {
    tableId: view.tableId,
  }
  await publishEvent(Event.VIEW_DELETED, properties)
}

async function exported(table: Table, format: TableExportFormat) {
  const properties: ViewExportedEvent = {
    tableId: table._id as string,
    format,
  }
  await publishEvent(Event.VIEW_EXPORTED, properties)
}

async function filterCreated(view: View, timestamp?: string | number) {
  const properties: ViewFilterCreatedEvent = {
    tableId: view.tableId,
  }
  await publishEvent(Event.VIEW_FILTER_CREATED, properties, timestamp)
}

async function filterUpdated(view: View) {
  const properties: ViewFilterUpdatedEvent = {
    tableId: view.tableId,
  }
  await publishEvent(Event.VIEW_FILTER_UPDATED, properties)
}

async function filterDeleted(view: View) {
  const properties: ViewFilterDeletedEvent = {
    tableId: view.tableId,
  }
  await publishEvent(Event.VIEW_FILTER_DELETED, properties)
}

async function calculationCreated(view: View, timestamp?: string | number) {
  const properties: ViewCalculationCreatedEvent = {
    tableId: view.tableId,
    calculation: view.calculation as ViewCalculation,
  }
  await publishEvent(Event.VIEW_CALCULATION_CREATED, properties, timestamp)
}

async function calculationUpdated(view: View) {
  const properties: ViewCalculationUpdatedEvent = {
    tableId: view.tableId,
    calculation: view.calculation as ViewCalculation,
  }
  await publishEvent(Event.VIEW_CALCULATION_UPDATED, properties)
}

async function calculationDeleted(existingView: View) {
  const properties: ViewCalculationDeletedEvent = {
    tableId: existingView.tableId,
    calculation: existingView.calculation as ViewCalculation,
  }
  await publishEvent(Event.VIEW_CALCULATION_DELETED, properties)
}

export default {
  created,
  updated,
  deleted,
  exported,
  filterCreated,
  filterUpdated,
  filterDeleted,
  calculationCreated,
  calculationUpdated,
  calculationDeleted,
}
