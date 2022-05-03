import { processEvent } from "../events"
import { Events, VersionCheckedEvent } from "@budibase/types"

export function nameUpdated() {
  const properties = {}
  processEvent(Events.ORG_NAME_UPDATED, properties)
}

export function logoUpdated() {
  const properties = {}
  processEvent(Events.ORG_LOGO_UPDATED, properties)
}

export function platformURLUpdated() {
  const properties = {}
  processEvent(Events.ORG_PLATFORM_URL_UPDATED, properties)
}

export function versionChecked(version: number) {
  const properties: VersionCheckedEvent = {
    version,
  }
  processEvent(Events.UPDATE_VERSION_CHECKED, properties)
}

// TODO
export function analyticsOptOut() {
  const properties = {}
  processEvent(Events.ANALYTICS_OPT_OUT, properties)
}
