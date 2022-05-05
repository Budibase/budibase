import { processEvent } from "../events"
import {
  Event,
  Screen,
  ScreenCreatedEvent,
  ScreenDeletedEvent,
} from "@budibase/types"

export function created(screen: Screen) {
  const properties: ScreenCreatedEvent = {}
  processEvent(Event.SCREEN_CREATED, properties)
}

export function deleted(screen: Screen) {
  const properties: ScreenDeletedEvent = {}
  processEvent(Event.SCREEN_DELETED, properties)
}
