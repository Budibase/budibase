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

export async function created(table: Table, timestamp?: string | number) {
  const properties: TableCreatedEvent = {
    tableId: table._id as string,
  }
  await publishEvent(Event.TABLE_CREATED, properties, timestamp)
}

export async function updated(table: Table) {
  const properties: TableUpdatedEvent = {
    tableId: table._id as string,
  }
  await publishEvent(Event.TABLE_UPDATED, properties)
}

export async function deleted(table: Table) {
  const properties: TableDeletedEvent = {
    tableId: table._id as string,
  }
  await publishEvent(Event.TABLE_DELETED, properties)
}

export async function exported(table: Table, format: TableExportFormat) {
  const properties: TableExportedEvent = {
    tableId: table._id as string,
    format,
  }
  await publishEvent(Event.TABLE_EXPORTED, properties)
}

export async function imported(table: Table, format: TableImportFormat) {
  const properties: TableImportedEvent = {
    tableId: table._id as string,
    format,
  }
  await publishEvent(Event.TABLE_IMPORTED, properties)
}
