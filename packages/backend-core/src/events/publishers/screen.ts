import { publishEvent } from "../events"
import {
  Event,
  Screen,
  ScreenCreatedEvent,
  ScreenDeletedEvent,
} from "@budibase/types"

export function created(screen: Screen) {
  const properties: ScreenCreatedEvent = {}
  publishEvent(Event.SCREEN_CREATED, properties)
}

export function deleted(screen: Screen) {
  const properties: ScreenDeletedEvent = {}
  publishEvent(Event.SCREEN_DELETED, properties)
}
