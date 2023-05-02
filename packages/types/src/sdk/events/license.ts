import { PlanType, PriceDuration } from "../licensing"

export interface LicensePlanChangedEvent {
  accountId: string
  from: PlanType
  to: PlanType
  // may not be on historical events
  // free plans won't have a duration
  duration: PriceDuration | undefined
  // may not be on historical events
  // free plans won't have a quantity
  quantity: number | undefined
}

export interface LicenseActivatedEvent {
  accountId: string
}

export interface LicenseCheckoutOpenedEvent {
  accountId: string
}

export interface LicenseCheckoutSuccessEvent {
  accountId: string
}

export interface LicensePortalOpenedEvent {
  accountId: string
}

export interface LicensePaymentFailedEvent {
  accountId: string
}

export interface LicensePaymentRecoveredEvent {
  accountId: string
}
