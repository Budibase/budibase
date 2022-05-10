import { publishEvent } from "../events"
import { Event, VersionCheckedEvent } from "@budibase/types"

export function nameUpdated() {
  const properties = {}
  publishEvent(Event.ORG_NAME_UPDATED, properties)
}

export function logoUpdated() {
  const properties = {}
  publishEvent(Event.ORG_LOGO_UPDATED, properties)
}

export function platformURLUpdated() {
  const properties = {}
  publishEvent(Event.ORG_PLATFORM_URL_UPDATED, properties)
}

export function versionChecked(version: number) {
  const properties: VersionCheckedEvent = {
    version,
  }
  publishEvent(Event.UPDATE_VERSION_CHECKED, properties)
}

// TODO
export function analyticsOptOut() {
  const properties = {}
  publishEvent(Event.ANALYTICS_OPT_OUT, properties)
}
