import { publishEvent } from "../events"
import {
  Event,
  License,
  LicenseActivatedEvent,
  LicenseDowngradedEvent,
  LicenseUpdatedEvent,
  LicenseUpgradedEvent,
} from "@budibase/types"

// TODO
export async function updgraded(license: License) {
  const properties: LicenseUpgradedEvent = {}
  await publishEvent(Event.LICENSE_UPGRADED, properties)
}

// TODO
export async function downgraded(license: License) {
  const properties: LicenseDowngradedEvent = {}
  await publishEvent(Event.LICENSE_DOWNGRADED, properties)
}

// TODO
export async function activated(license: License) {
  const properties: LicenseActivatedEvent = {}
  await publishEvent(Event.LICENSE_ACTIVATED, properties)
}
