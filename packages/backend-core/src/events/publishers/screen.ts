import { publishEvent } from "../events"
import {
  Event,
  Screen,
  ScreenCreatedEvent,
  ScreenDeletedEvent,
} from "@budibase/types"

export async function created(screen: Screen, timestamp?: string) {
  const properties: ScreenCreatedEvent = {}
  await publishEvent(Event.SCREEN_CREATED, properties, timestamp)
}

export async function deleted(screen: Screen) {
  const properties: ScreenDeletedEvent = {}
  await publishEvent(Event.SCREEN_DELETED, properties)
}
