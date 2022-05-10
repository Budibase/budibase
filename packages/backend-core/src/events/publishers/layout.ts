import { publishEvent } from "../events"
import {
  Event,
  Layout,
  LayoutCreatedEvent,
  LayoutDeletedEvent,
} from "@budibase/types"

export function created(layout: Layout) {
  const properties: LayoutCreatedEvent = {}
  publishEvent(Event.LAYOUT_CREATED, properties)
}

export function deleted(layout: Layout) {
  const properties: LayoutDeletedEvent = {}
  publishEvent(Event.LAYOUT_DELETED, properties)
}
