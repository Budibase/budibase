import { processEvent } from "../events"
import {
  Events,
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
} from "@budibase/types"

/* eslint-disable */

export function created(view: View) {
  const properties: ViewCreatedEvent = {}
  processEvent(Events.VIEW_CREATED, properties)
}

export function updated(view: View) {
  const properties: ViewUpdatedEvent = {}
  processEvent(Events.VIEW_UPDATED, properties)
}

export function deleted() {
  const properties: ViewDeletedEvent = {}
  processEvent(Events.VIEW_DELETED, properties)
}

export function exported(table, format) {
  const properties: ViewExportedEvent = {}
  processEvent(Events.VIEW_EXPORTED, properties)
}

export function filterCreated() {
  const properties: ViewFilterCreatedEvent = {}
  processEvent(Events.VIEW_FILTER_CREATED, properties)
}

export function filterUpdated() {
  const properties: ViewFilterUpdatedEvent = {}
  processEvent(Events.VIEW_FILTER_UPDATED, properties)
}

export function filterDeleted() {
  const properties: ViewFilterDeletedEvent = {}
  processEvent(Events.VIEW_FILTER_DELETED, properties)
}

export function calculationCreated() {
  const properties: ViewCalculationCreatedEvent = {}
  processEvent(Events.VIEW_CALCULATION_CREATED, properties)
}

export function calculationUpdated() {
  const properties: ViewCalculationUpdatedEvent = {}
  processEvent(Events.VIEW_CALCULATION_UPDATED, properties)
}

export function calculationDeleted() {
  const properties: ViewCalculationDeletedEvent = {}
  processEvent(Events.VIEW_CALCULATION_DELETED, properties)
}
