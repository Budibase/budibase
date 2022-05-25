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

export async function created(table: Table, timestamp?: string) {
  const properties: TableCreatedEvent = {}
  await publishEvent(Event.TABLE_CREATED, properties, timestamp)
}

export async function updated(table: Table) {
  const properties: TableUpdatedEvent = {}
  await publishEvent(Event.TABLE_UPDATED, properties)
}

export async function deleted(table: Table) {
  const properties: TableDeletedEvent = {}
  await publishEvent(Event.TABLE_DELETED, properties)
}

export async function exported(table: Table, format: TableExportFormat) {
  const properties: TableExportedEvent = {}
  await publishEvent(Event.TABLE_EXPORTED, properties)
}

export async function imported(table: Table, format: TableImportFormat) {
  const properties: TableImportedEvent = {}
  await publishEvent(Event.TABLE_IMPORTED, properties)
}
