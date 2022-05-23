import { publishEvent } from "../events"
import {
  Event,
  Layout,
  LayoutCreatedEvent,
  LayoutDeletedEvent,
} from "@budibase/types"

export async function created(layout: Layout) {
  const properties: LayoutCreatedEvent = {}
  await publishEvent(Event.LAYOUT_CREATED, properties)
}

export async function deleted(layout: Layout) {
  const properties: LayoutDeletedEvent = {}
  await publishEvent(Event.LAYOUT_DELETED, properties)
}
