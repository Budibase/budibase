import { publishEvent } from "../events"
import {
  Event,
  LicenseActivatedEvent,
  LicensePlanChangedEvent,
  PlanType,
  Account,
  LicensePortalOpenedEvent,
  LicenseCheckoutSuccessEvent,
  LicenseCheckoutOpenedEvent,
  LicensePaymentFailedEvent,
  LicensePaymentRecoveredEvent,
  PriceDuration,
} from "@budibase/types"

async function planChanged(
  account: Account,
  opts: {
    from: PlanType
    to: PlanType
    fromQuantity: number | undefined
    toQuantity: number | undefined
    fromDuration: PriceDuration | undefined
    toDuration: PriceDuration | undefined
  }
) {
  const properties: LicensePlanChangedEvent = {
    accountId: account.accountId,
    ...opts,
  }
  await publishEvent(Event.LICENSE_PLAN_CHANGED, properties)
}

async function activated(accountId: string) {
  const properties: LicenseActivatedEvent = {
    accountId,
  }
  await publishEvent(Event.LICENSE_ACTIVATED, properties)
}

async function checkoutOpened(accountId: string) {
  const properties: LicenseCheckoutOpenedEvent = {
    accountId,
  }
  await publishEvent(Event.LICENSE_CHECKOUT_OPENED, properties)
}

async function checkoutSuccess(accountId: string) {
  const properties: LicenseCheckoutSuccessEvent = {
    accountId,
  }
  await publishEvent(Event.LICENSE_CHECKOUT_SUCCESS, properties)
}

async function portalOpened(accountId: string) {
  const properties: LicensePortalOpenedEvent = {
    accountId,
  }
  await publishEvent(Event.LICENSE_PORTAL_OPENED, properties)
}

async function paymentFailed(accountId: string) {
  const properties: LicensePaymentFailedEvent = {
    accountId,
  }
  await publishEvent(Event.LICENSE_PAYMENT_FAILED, properties)
}

async function paymentRecovered(accountId: string) {
  const properties: LicensePaymentRecoveredEvent = {
    accountId,
  }
  await publishEvent(Event.LICENSE_PAYMENT_RECOVERED, properties)
}

export default {
  planChanged,
  activated,
  checkoutOpened,
  checkoutSuccess,
  portalOpened,
  paymentFailed,
  paymentRecovered,
}
