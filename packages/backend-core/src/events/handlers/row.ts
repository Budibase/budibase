import { processEvent } from "../events"
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
  processEvent(Event.ROW_IMPORT, properties)
}
