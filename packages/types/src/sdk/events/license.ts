import { PlanType } from "../licensing"

export interface LicenseTierChangedEvent {
  accountId: string
  from: number
  to: number
}

export interface LicensePlanChangedEvent {
  accountId: string
  from: PlanType
  to: PlanType
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
