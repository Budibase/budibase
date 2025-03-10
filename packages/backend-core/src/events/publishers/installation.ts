import { publishEvent } from "../events"
import type { VersionCheckedEvent, VersionChangeEvent } from "@budibase/types"
import { Event } from "@budibase/types"

async function versionChecked(version: string) {
  const properties: VersionCheckedEvent = {
    currentVersion: version,
  }
  await publishEvent(Event.INSTALLATION_VERSION_CHECKED, properties)
}

async function upgraded(from: string, to: string) {
  const properties: VersionChangeEvent = {
    from,
    to,
  }

  await publishEvent(Event.INSTALLATION_VERSION_UPGRADED, properties)
}

async function downgraded(from: string, to: string) {
  const properties: VersionChangeEvent = {
    from,
    to,
  }
  await publishEvent(Event.INSTALLATION_VERSION_DOWNGRADED, properties)
}

async function firstStartup() {
  const properties = {}
  await publishEvent(Event.INSTALLATION_FIRST_STARTUP, properties)
}

export default {
  versionChecked,
  upgraded,
  downgraded,
  firstStartup,
}
