import { publishEvent } from "../events"
import {
  Event,
  RowImportedEvent,
  RowImportFormat,
  Table,
} from "@budibase/types"

/* eslint-disable */

// exports.created = () => {
//   const properties = {}
//   events.processEvent(Events.ROW_CREATED, properties)
// }

export const imported = (
  table: Table,
  format: RowImportFormat,
  count: number
) => {
  const properties: RowImportedEvent = {}
  publishEvent(Event.ROW_IMPORT, properties)
}
