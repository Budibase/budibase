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

export function created(view: View) {
  const properties: ViewCreatedEvent = {}
  publishEvent(Event.VIEW_CREATED, properties)
}

export function updated(view: View) {
  const properties: ViewUpdatedEvent = {}
  publishEvent(Event.VIEW_UPDATED, properties)
}

export function deleted() {
  const properties: ViewDeletedEvent = {}
  publishEvent(Event.VIEW_DELETED, properties)
}

export function exported(table: Table, format: TableExportFormat) {
  const properties: ViewExportedEvent = {}
  publishEvent(Event.VIEW_EXPORTED, properties)
}

export function filterCreated() {
  const properties: ViewFilterCreatedEvent = {}
  publishEvent(Event.VIEW_FILTER_CREATED, properties)
}

export function filterUpdated() {
  const properties: ViewFilterUpdatedEvent = {}
  publishEvent(Event.VIEW_FILTER_UPDATED, properties)
}

export function filterDeleted() {
  const properties: ViewFilterDeletedEvent = {}
  publishEvent(Event.VIEW_FILTER_DELETED, properties)
}

export function calculationCreated(calculation: ViewCalculation) {
  const properties: ViewCalculationCreatedEvent = {}
  publishEvent(Event.VIEW_CALCULATION_CREATED, properties)
}

export function calculationUpdated() {
  const properties: ViewCalculationUpdatedEvent = {}
  publishEvent(Event.VIEW_CALCULATION_UPDATED, properties)
}

export function calculationDeleted() {
  const properties: ViewCalculationDeletedEvent = {}
  publishEvent(Event.VIEW_CALCULATION_DELETED, properties)
}
