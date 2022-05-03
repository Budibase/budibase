import { processEvent } from "../events"
import {
  Events,
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
  processEvent(Events.LICENSE_UPGRADED, properties)
}

// TODO
export function downgraded(license: License) {
  const properties: LicenseDowngradedEvent = {}
  processEvent(Events.LICENSE_DOWNGRADED, properties)
}

// TODO
export function updated(license: License) {
  const properties: LicenseUpdatedEvent = {}
  processEvent(Events.LICENSE_UPDATED, properties)
}

// TODO
export function activated(license: License) {
  const properties: LicenseActivatedEvent = {}
  processEvent(Events.LICENSE_ACTIVATED, properties)
}

// TODO
export function quotaExceeded(quotaName: string, value: number) {
  const properties: LicenseQuotaExceededEvent = {
    name: quotaName,
    value,
  }
  processEvent(Events.LICENSE_QUOTA_EXCEEDED, properties)
}
