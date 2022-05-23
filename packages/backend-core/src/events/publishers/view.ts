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
  ViewCalculation,
  Table,
  TableExportFormat,
} from "@budibase/types"

/* eslint-disable */

export async function created(view: View) {
  const properties: ViewCreatedEvent = {}
  await publishEvent(Event.VIEW_CREATED, properties)
}

export async function updated(view: View) {
  const properties: ViewUpdatedEvent = {}
  await publishEvent(Event.VIEW_UPDATED, properties)
}

export async function deleted() {
  const properties: ViewDeletedEvent = {}
  await publishEvent(Event.VIEW_DELETED, properties)
}

export async function exported(table: Table, format: TableExportFormat) {
  const properties: ViewExportedEvent = {}
  await publishEvent(Event.VIEW_EXPORTED, properties)
}

export async function filterCreated() {
  const properties: ViewFilterCreatedEvent = {}
  await publishEvent(Event.VIEW_FILTER_CREATED, properties)
}

export async function filterUpdated() {
  const properties: ViewFilterUpdatedEvent = {}
  await publishEvent(Event.VIEW_FILTER_UPDATED, properties)
}

export async function filterDeleted() {
  const properties: ViewFilterDeletedEvent = {}
  await publishEvent(Event.VIEW_FILTER_DELETED, properties)
}

export async function calculationCreated(calculation: ViewCalculation) {
  const properties: ViewCalculationCreatedEvent = {}
  await publishEvent(Event.VIEW_CALCULATION_CREATED, properties)
}

export async function calculationUpdated() {
  const properties: ViewCalculationUpdatedEvent = {}
  await publishEvent(Event.VIEW_CALCULATION_UPDATED, properties)
}

export async function calculationDeleted() {
  const properties: ViewCalculationDeletedEvent = {}
  await publishEvent(Event.VIEW_CALCULATION_DELETED, properties)
}
