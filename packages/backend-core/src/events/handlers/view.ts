import { processEvent } from "../events"
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
  Table,
  TableExportFormat,
} from "@budibase/types"

/* eslint-disable */

export function created(view: View) {
  const properties: ViewCreatedEvent = {}
  processEvent(Event.VIEW_CREATED, properties)
}

export function updated(view: View) {
  const properties: ViewUpdatedEvent = {}
  processEvent(Event.VIEW_UPDATED, properties)
}

export function deleted() {
  const properties: ViewDeletedEvent = {}
  processEvent(Event.VIEW_DELETED, properties)
}

export function exported(table: Table, format: TableExportFormat) {
  const properties: ViewExportedEvent = {}
  processEvent(Event.VIEW_EXPORTED, properties)
}

export function filterCreated() {
  const properties: ViewFilterCreatedEvent = {}
  processEvent(Event.VIEW_FILTER_CREATED, properties)
}

export function filterUpdated() {
  const properties: ViewFilterUpdatedEvent = {}
  processEvent(Event.VIEW_FILTER_UPDATED, properties)
}

export function filterDeleted() {
  const properties: ViewFilterDeletedEvent = {}
  processEvent(Event.VIEW_FILTER_DELETED, properties)
}

export function calculationCreated() {
  const properties: ViewCalculationCreatedEvent = {}
  processEvent(Event.VIEW_CALCULATION_CREATED, properties)
}

export function calculationUpdated() {
  const properties: ViewCalculationUpdatedEvent = {}
  processEvent(Event.VIEW_CALCULATION_UPDATED, properties)
}

export function calculationDeleted() {
  const properties: ViewCalculationDeletedEvent = {}
  processEvent(Event.VIEW_CALCULATION_DELETED, properties)
}
