import { processEvent } from "../events"
import { Event, VersionCheckedEvent } from "@budibase/types"

export function nameUpdated() {
  const properties = {}
  processEvent(Event.ORG_NAME_UPDATED, properties)
}

export function logoUpdated() {
  const properties = {}
  processEvent(Event.ORG_LOGO_UPDATED, properties)
}

export function platformURLUpdated() {
  const properties = {}
  processEvent(Event.ORG_PLATFORM_URL_UPDATED, properties)
}

export function versionChecked(version: number) {
  const properties: VersionCheckedEvent = {
    version,
  }
  processEvent(Event.UPDATE_VERSION_CHECKED, properties)
}

// TODO
export function analyticsOptOut() {
  const properties = {}
  processEvent(Event.ANALYTICS_OPT_OUT, properties)
}
