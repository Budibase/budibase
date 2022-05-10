import { publishEvent } from "../events"
import {
  Event,
  TableExportFormat,
  TableImportFormat,
  Table,
  TableCreatedEvent,
  TableUpdatedEvent,
  TableDeletedEvent,
  TableExportedEvent,
  TableImportedEvent,
} from "@budibase/types"

/* eslint-disable */

export function created(table: Table) {
  const properties: TableCreatedEvent = {}
  publishEvent(Event.TABLE_CREATED, properties)
}

export function updated(table: Table) {
  const properties: TableUpdatedEvent = {}
  publishEvent(Event.TABLE_UPDATED, properties)
}

export function deleted(table: Table) {
  const properties: TableDeletedEvent = {}
  publishEvent(Event.TABLE_DELETED, properties)
}

export function exported(table: Table, format: TableExportFormat) {
  const properties: TableExportedEvent = {}
  publishEvent(Event.TABLE_EXPORTED, properties)
}

export function imported(table: Table, format: TableImportFormat) {
  const properties: TableImportedEvent = {}
  publishEvent(Event.TABLE_IMPORTED, properties)
}

// TODO
export function permissionUpdated() {
  const properties = {}
  publishEvent(Event.TABLE_PERMISSION_UPDATED, properties)
}
