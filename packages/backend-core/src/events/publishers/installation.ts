import { publishEvent } from "../events"
import { Event, VersionCheckedEvent, VersionChangeEvent } from "@budibase/types"

export async function versionChecked(version: string) {
  const properties: VersionCheckedEvent = {
    currentVersion: version,
  }
  await publishEvent(Event.INSTALLATION_VERSION_CHECKED, properties)
}

export async function upgraded(from: string, to: string) {
  const properties: VersionChangeEvent = {
    from,
    to,
  }

  await publishEvent(Event.INSTALLATION_VERSION_UPGRADED, properties)
}

export async function downgraded(from: string, to: string) {
  const properties: VersionChangeEvent = {
    from,
    to,
  }
  await publishEvent(Event.INSTALLATION_VERSION_DOWNGRADED, properties)
}

export async function firstStartup() {
  const properties = {}
  await publishEvent(Event.INSTALLATION_FIRST_STARTUP, properties)
}
