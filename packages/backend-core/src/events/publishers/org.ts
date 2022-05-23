import { publishEvent } from "../events"
import { Event, VersionCheckedEvent } from "@budibase/types"

export async function nameUpdated() {
  const properties = {}
  await publishEvent(Event.ORG_NAME_UPDATED, properties)
}

export async function logoUpdated() {
  const properties = {}
  await publishEvent(Event.ORG_LOGO_UPDATED, properties)
}

export async function platformURLUpdated() {
  const properties = {}
  await publishEvent(Event.ORG_PLATFORM_URL_UPDATED, properties)
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
