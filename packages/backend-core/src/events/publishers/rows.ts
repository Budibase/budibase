import { publishEvent } from "../events"
import {
  Event,
  RowsImportedEvent,
  RowsCreatedEvent,
  RowImportFormat,
  Table,
} from "@budibase/types"

/* eslint-disable */

export const created = (count: number) => {
  const properties: RowsCreatedEvent = {
    count,
  }
  publishEvent(Event.ROWS_CREATED, properties)
}

export const imported = (
  table: Table,
  format: RowImportFormat,
  count: number
) => {
  const properties: RowsImportedEvent = {}
  publishEvent(Event.ROWS_IMPORTED, properties)
}
