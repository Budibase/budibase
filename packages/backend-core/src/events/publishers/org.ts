import { publishEvent } from "../events"
import { Event } from "@budibase/types"

async function nameUpdated(timestamp?: string | number) {
  const properties = {}
  await publishEvent(Event.ORG_NAME_UPDATED, properties, timestamp)
}

async function logoUpdated(timestamp?: string | number) {
  const properties = {}
  await publishEvent(Event.ORG_LOGO_UPDATED, properties, timestamp)
}

async function platformURLUpdated(timestamp?: string | number) {
  const properties = {}
  await publishEvent(Event.ORG_PLATFORM_URL_UPDATED, properties, timestamp)
}

// TODO

async function analyticsOptOut() {
  const properties = {}
  await publishEvent(Event.ANALYTICS_OPT_OUT, properties)
}

async function analyticsOptIn() {
  const properties = {}
  await publishEvent(Event.ANALYTICS_OPT_OUT, properties)
}

export default {
  nameUpdated,
  logoUpdated,
  platformURLUpdated,
  analyticsOptOut,
  analyticsOptIn,
}
