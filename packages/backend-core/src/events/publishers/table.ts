import { publishEvent } from "../events"
import {
  Event,
  FieldType,
  Table,
  TableCreatedEvent,
  TableDeletedEvent,
  TableExportedEvent,
  TableExportFormat,
  TableImportedEvent,
  TableUpdatedEvent,
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

async function updated(oldTable: Table, newTable: Table) {
  // only publish the event if it has fields we are interested in
  let defaultValues, aiColumn

  // check that new fields have been added
  for (const key in newTable.schema) {
    if (!oldTable.schema[key]) {
      const newColumn = newTable.schema[key]
      if ("default" in newColumn && newColumn.default != null) {
        defaultValues = true
      }
      if (newColumn.type === FieldType.AI) {
        aiColumn = newColumn.operation
      }
    }
  }

  const properties: TableUpdatedEvent = {
    tableId: newTable._id as string,
    defaultValues,
    aiColumn,
    audited: {
      name: newTable.name,
    },
  }
  if (defaultValues || aiColumn) {
    await publishEvent(Event.TABLE_UPDATED, properties)
  }
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
