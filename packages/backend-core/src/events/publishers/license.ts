import { publishEvent } from "../events"
import {
  Event,
  LicenseActivatedEvent,
  LicensePlanChangedEvent,
  LicenseTierChangedEvent,
  PlanType,
  Account,
  LicensePortalOpenedEvent,
  LicenseCheckoutSuccessEvent,
  LicenseCheckoutOpenedEvent,
  LicensePaymentFailedEvent,
  LicensePaymentRecoveredEvent,
} from "@budibase/types"

async function tierChanged(account: Account, from: number, to: number) {
  const properties: LicenseTierChangedEvent = {
    accountId: account.accountId,
    to,
    from,
  }
  await publishEvent(Event.LICENSE_TIER_CHANGED, properties)
}

async function planChanged(account: Account, from: PlanType, to: PlanType) {
  const properties: LicensePlanChangedEvent = {
    accountId: account.accountId,
    to,
    from,
  }
  await publishEvent(Event.LICENSE_PLAN_CHANGED, properties)
}

async function activated(account: Account) {
  const properties: LicenseActivatedEvent = {
    accountId: account.accountId,
  }
  await publishEvent(Event.LICENSE_ACTIVATED, properties)
}

async function checkoutOpened(account: Account) {
  const properties: LicenseCheckoutOpenedEvent = {
    accountId: account.accountId,
  }
  await publishEvent(Event.LICENSE_CHECKOUT_OPENED, properties)
}

async function checkoutSuccess(account: Account) {
  const properties: LicenseCheckoutSuccessEvent = {
    accountId: account.accountId,
  }
  await publishEvent(Event.LICENSE_CHECKOUT_SUCCESS, properties)
}

async function portalOpened(account: Account) {
  const properties: LicensePortalOpenedEvent = {
    accountId: account.accountId,
  }
  await publishEvent(Event.LICENSE_PORTAL_OPENED, properties)
}

async function paymentFailed(account: Account) {
  const properties: LicensePaymentFailedEvent = {
    accountId: account.accountId,
  }
  await publishEvent(Event.LICENSE_PAYMENT_FAILED, properties)
}

async function paymentRecovered(account: Account) {
  const properties: LicensePaymentRecoveredEvent = {
    accountId: account.accountId,
  }
  await publishEvent(Event.LICENSE_PAYMENT_RECOVERED, properties)
}

export default {
  tierChanged,
  planChanged,
  activated,
  checkoutOpened,
  checkoutSuccess,
  portalOpened,
  paymentFailed,
  paymentRecovered,
}
