import { publishEvent } from "../events"
import type {
  Layout,
  LayoutCreatedEvent,
  LayoutDeletedEvent,
} from "@budibase/types"
import { Event } from "@budibase/types"

async function created(layout: Layout, timestamp?: string | number) {
  const properties: LayoutCreatedEvent = {
    layoutId: layout._id as string,
  }
  await publishEvent(Event.LAYOUT_CREATED, properties, timestamp)
}

async function deleted(layoutId: string) {
  const properties: LayoutDeletedEvent = {
    layoutId,
  }
  await publishEvent(Event.LAYOUT_DELETED, properties)
}

export default {
  created,
  deleted,
}
