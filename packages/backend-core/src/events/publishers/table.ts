import { publishEvent } from "../events"
import {
  Event,
  TableExportFormat,
  Table,
  TableCreatedEvent,
  TableUpdatedEvent,
  TableDeletedEvent,
  TableExportedEvent,
  TableImportedEvent,
} from "@budibase/types"

async function created(table: Table, timestamp?: string | number) {
  const properties: TableCreatedEvent = {
    tableId: table._id as string,
    audited: {
      name: table.name,
    },
  }
  await publishEvent(Event.TABLE_CREATED, properties, timestamp)
}

async function updated(table: Table) {
  const properties: TableUpdatedEvent = {
    tableId: table._id as string,
    audited: {
      name: table.name,
    },
  }
  await publishEvent(Event.TABLE_UPDATED, properties)
}

async function deleted(table: Table) {
  const properties: TableDeletedEvent = {
    tableId: table._id as string,
    audited: {
      name: table.name,
    },
  }
  await publishEvent(Event.TABLE_DELETED, properties)
}

async function exported(table: Table, format: TableExportFormat) {
  const properties: TableExportedEvent = {
    tableId: table._id as string,
    format,
    audited: {
      name: table.name,
    },
  }
  await publishEvent(Event.TABLE_EXPORTED, properties)
}

async function imported(table: Table) {
  const properties: TableImportedEvent = {
    tableId: table._id as string,
    audited: {
      name: table.name,
    },
  }
  await publishEvent(Event.TABLE_IMPORTED, properties)
}

export default {
  created,
  updated,
  deleted,
  exported,
  imported,
}
