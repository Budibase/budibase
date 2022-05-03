import { processEvent } from "../events"
import {
  Events,
  Screen,
  ScreenCreatedEvent,
  ScreenDeletedEvent,
} from "@budibase/types"

export function created(screen: Screen) {
  const properties: ScreenCreatedEvent = {}
  processEvent(Events.SCREEN_CREATED, properties)
}

export function deleted(screen: Screen) {
  const properties: ScreenDeletedEvent = {}
  processEvent(Events.SCREEN_DELETED, properties)
}
