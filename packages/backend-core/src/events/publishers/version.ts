import { publishEvent } from "../events"
import { Event, VersionCheckedEvent, VersionChangeEvent } from "@budibase/types"

export async function checked(version: string) {
  const properties: VersionCheckedEvent = {
    currentVersion: version,
  }
  await publishEvent(Event.VERSION_CHECKED, properties)
}

export async function upgraded(from: string, to: string) {
  const properties: VersionChangeEvent = {
    from,
    to,
  }

  await publishEvent(Event.VERSION_UPGRADED, properties)
}

export async function downgraded(from: string, to: string) {
  const properties: VersionChangeEvent = {
    from,
    to,
  }
  await publishEvent(Event.VERSION_DOWNGRADED, properties)
}
