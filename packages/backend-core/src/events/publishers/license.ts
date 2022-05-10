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
export function updgraded(license: License) {
  const properties: LicenseUpgradedEvent = {}
  publishEvent(Event.LICENSE_UPGRADED, properties)
}

// TODO
export function downgraded(license: License) {
  const properties: LicenseDowngradedEvent = {}
  publishEvent(Event.LICENSE_DOWNGRADED, properties)
}

// TODO
export function updated(license: License) {
  const properties: LicenseUpdatedEvent = {}
  publishEvent(Event.LICENSE_UPDATED, properties)
}

// TODO
export function activated(license: License) {
  const properties: LicenseActivatedEvent = {}
  publishEvent(Event.LICENSE_ACTIVATED, properties)
}

// TODO
export function quotaExceeded(quotaName: string, value: number) {
  const properties: LicenseQuotaExceededEvent = {
    name: quotaName,
    value,
  }
  publishEvent(Event.LICENSE_QUOTA_EXCEEDED, properties)
}
