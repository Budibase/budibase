import { publishEvent } from "../events"
import {
  Event,
  Screen,
  ScreenCreatedEvent,
  ScreenDeletedEvent,
} from "@budibase/types"

async function created(screen: Screen, timestamp?: string | number) {
  const properties: ScreenCreatedEvent = {
    layoutId: screen.layoutId,
    screenId: screen._id as string,
    roleId: screen.routing.roleId,
    audited: {
      name: screen.routing?.route,
    },
  }
  await publishEvent(Event.SCREEN_CREATED, properties, timestamp)
}

async function deleted(screen: Screen) {
  const properties: ScreenDeletedEvent = {
    layoutId: screen.layoutId,
    screenId: screen._id as string,
    roleId: screen.routing.roleId,
    audited: {
      name: screen.routing?.route,
    },
  }
  await publishEvent(Event.SCREEN_DELETED, properties)
}

export default {
  created,
  deleted,
}
