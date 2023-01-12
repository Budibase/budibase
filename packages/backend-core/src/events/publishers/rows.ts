import { publishEvent } from "../events"
import {
  Event,
  RowsImportedEvent,
  RowsCreatedEvent,
  RowImportFormat,
  Table,
} from "@budibase/types"

/* eslint-disable */

const created = async (count: number, timestamp?: string | number) => {
  const properties: RowsCreatedEvent = {
    count,
  }
  await publishEvent(Event.ROWS_CREATED, properties, timestamp)
}

const imported = async (
  table: Table,
  format: RowImportFormat,
  count: number
) => {
  const properties: RowsImportedEvent = {
    tableId: table._id as string,
    format,
    count,
  }
  await publishEvent(Event.ROWS_IMPORTED, properties)
}

export default {
  created,
  imported,
}
