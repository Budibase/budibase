import { publishEvent } from "../events"
import {
  Event,
  License,
  LicenseActivatedEvent,
  LicenseDowngradedEvent,
  LicenseQuotaExceededEvent,
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
export async function updated(license: License) {
  const properties: LicenseUpdatedEvent = {}
  await publishEvent(Event.LICENSE_UPDATED, properties)
}

// TODO
export async function activated(license: License) {
  const properties: LicenseActivatedEvent = {}
  await publishEvent(Event.LICENSE_ACTIVATED, properties)
}

// TODO
export async function quotaExceeded(quotaName: string, value: number) {
  const properties: LicenseQuotaExceededEvent = {
    name: quotaName,
    value,
  }
  await publishEvent(Event.LICENSE_QUOTA_EXCEEDED, properties)
}
