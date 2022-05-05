import { processEvent } from "../events"
import {
  Event,
  Layout,
  LayoutCreatedEvent,
  LayoutDeletedEvent,
} from "@budibase/types"

export function created(layout: Layout) {
  const properties: LayoutCreatedEvent = {}
  processEvent(Event.LAYOUT_CREATED, properties)
}

export function deleted(layout: Layout) {
  const properties: LayoutDeletedEvent = {}
  processEvent(Event.LAYOUT_DELETED, properties)
}
