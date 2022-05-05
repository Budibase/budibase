import { processEvent } from "../events"
import {
  Events,
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
  processEvent(Events.TABLE_CREATED, properties)
}

export function updated(table: Table) {
  const properties: TableUpdatedEvent = {}
  processEvent(Events.TABLE_UPDATED, properties)
}

export function deleted(table: Table) {
  const properties: TableDeletedEvent = {}
  processEvent(Events.TABLE_DELETED, properties)
}

export function exported(table: Table, format: TableExportFormat) {
  const properties: TableExportedEvent = {}
  processEvent(Events.TABLE_EXPORTED, properties)
}

export function imported(table: Table, format: TableImportFormat) {
  const properties: TableImportedEvent = {}
  processEvent(Events.TABLE_IMPORTED, properties)
}

// TODO
export function permissionUpdated() {
  const properties = {}
  processEvent(Events.TABLE_PERMISSION_UPDATED, properties)
}
