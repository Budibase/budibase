import { processEvent } from "../events"
import {
  Events,
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
  processEvent(Events.ROW_IMPORT, properties)
}
