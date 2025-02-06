import { publishEvent } from "../events"
import {
  CalculationType,
  Event,
  Table,
  TableExportFormat,
  View,
  ViewCalculation,
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
  ViewV2,
  ViewJoinCreatedEvent,
} from "@budibase/types"

async function created(view: ViewV2, timestamp?: string | number) {
  const properties: ViewCreatedEvent = {
    name: view.name,
    type: view.type,
    tableId: view.tableId,
  }
  await publishEvent(Event.VIEW_CREATED, properties, timestamp)
}

async function updated(view: ViewV2) {
  const properties: ViewUpdatedEvent = {
    tableId: view.tableId,
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

async function filterCreated(
  { tableId, filterGroups }: { tableId: string; filterGroups: number },
  timestamp?: string | number
) {
  const properties: ViewFilterCreatedEvent = {
    tableId,
    filterGroups,
  }
  await publishEvent(Event.VIEW_FILTER_CREATED, properties, timestamp)
}

async function filterUpdated({
  tableId,
  filterGroups,
}: {
  tableId: string
  filterGroups: number
}) {
  const properties: ViewFilterUpdatedEvent = {
    tableId: tableId,
    filterGroups,
  }
  await publishEvent(Event.VIEW_FILTER_UPDATED, properties)
}

async function filterDeleted(view: View) {
  const properties: ViewFilterDeletedEvent = {
    tableId: view.tableId,
  }
  await publishEvent(Event.VIEW_FILTER_DELETED, properties)
}

async function calculationCreated(
  {
    tableId,
    calculationType,
  }: { tableId: string; calculationType: CalculationType },
  timestamp?: string | number
) {
  const properties: ViewCalculationCreatedEvent = {
    tableId,
    calculation: calculationType,
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

async function viewJoinCreated(tableId: any, timestamp?: string | number) {
  const properties: ViewJoinCreatedEvent = {
    tableId,
  }
  await publishEvent(Event.VIEW_JOIN_CREATED, properties, timestamp)
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
  viewJoinCreated,
}
