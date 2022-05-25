import { publishEvent } from "../events"
import { Event, VersionCheckedEvent } from "@budibase/types"

export async function nameUpdated(timestamp?: string | number) {
  const properties = {}
  await publishEvent(Event.ORG_NAME_UPDATED, properties, timestamp)
}

export async function logoUpdated(timestamp?: string | number) {
  const properties = {}
  await publishEvent(Event.ORG_LOGO_UPDATED, properties, timestamp)
}

export async function platformURLUpdated(timestamp?: string | number) {
  const properties = {}
  await publishEvent(Event.ORG_PLATFORM_URL_UPDATED, properties, timestamp)
}

export async function versionChecked(version: number) {
  const properties: VersionCheckedEvent = {
    version,
  }
  await publishEvent(Event.UPDATE_VERSION_CHECKED, properties)
}

// TODO
export async function analyticsOptOut() {
  const properties = {}
  await publishEvent(Event.ANALYTICS_OPT_OUT, properties)
}

export async function analyticsOptIn() {
  const properties = {}
  await publishEvent(Event.ANALYTICS_OPT_OUT, properties)
}
