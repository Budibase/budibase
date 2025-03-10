import { publishEvent } from "../events"
import type { RowActionCreatedEvent } from "@budibase/types"
import { Event } from "@budibase/types"

async function created(
  rowAction: RowActionCreatedEvent,
  timestamp?: string | number
) {
  await publishEvent(Event.ROW_ACTION_CREATED, rowAction, timestamp)
}

export default {
  created,
}
