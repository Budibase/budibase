import { processEvent } from "../events"
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
  processEvent(Event.TABLE_CREATED, properties)
}

export function updated(table: Table) {
  const properties: TableUpdatedEvent = {}
  processEvent(Event.TABLE_UPDATED, properties)
}

export function deleted(table: Table) {
  const properties: TableDeletedEvent = {}
  processEvent(Event.TABLE_DELETED, properties)
}

export function exported(table: Table, format: TableExportFormat) {
  const properties: TableExportedEvent = {}
  processEvent(Event.TABLE_EXPORTED, properties)
}

export function imported(table: Table, format: TableImportFormat) {
  const properties: TableImportedEvent = {}
  processEvent(Event.TABLE_IMPORTED, properties)
}

// TODO
export function permissionUpdated() {
  const properties = {}
  processEvent(Event.TABLE_PERMISSION_UPDATED, properties)
}
