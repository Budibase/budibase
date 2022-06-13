import { publishEvent } from "../events"
import {
  Event,
  Screen,
  ScreenCreatedEvent,
  ScreenDeletedEvent,
} from "@budibase/types"

export async function created(screen: Screen, timestamp?: string | number) {
  const properties: ScreenCreatedEvent = {
    layoutId: screen.layoutId,
    screenId: screen._id as string,
    roleId: screen.routing.roleId,
  }
  await publishEvent(Event.SCREEN_CREATED, properties, timestamp)
}

export async function deleted(screen: Screen) {
  const properties: ScreenDeletedEvent = {
    layoutId: screen.layoutId,
    screenId: screen._id as string,
    roleId: screen.routing.roleId,
  }
  await publishEvent(Event.SCREEN_DELETED, properties)
}
