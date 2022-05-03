import { processEvent } from "../events"
import {
  Events,
  Layout,
  LayoutCreatedEvent,
  LayoutDeletedEvent,
} from "@budibase/types"

export function created(layout: Layout) {
  const properties: LayoutCreatedEvent = {}
  processEvent(Events.LAYOUT_CREATED, properties)
}

export function deleted(layout: Layout) {
  const properties: LayoutDeletedEvent = {}
  processEvent(Events.LAYOUT_DELETED, properties)
}
