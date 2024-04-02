import { publishEvent } from "../events"
import {
  Event,
  Account,
  AccountCreatedEvent,
  AccountDeletedEvent,
  AccountVerifiedEvent,
  Identity,
} from "@budibase/types"

async function created(account: Account, identityOverride?: Identity) {
  const properties: AccountCreatedEvent = {
    tenantId: account.tenantId,
  }
  await publishEvent(
    Event.ACCOUNT_CREATED,
    properties,
    undefined,
    identityOverride
  )
}

async function deleted(account: Account) {
  const properties: AccountDeletedEvent = {
    tenantId: account.tenantId,
  }
  await publishEvent(Event.ACCOUNT_DELETED, properties)
}

async function verified(account: Account) {
  const properties: AccountVerifiedEvent = {
    tenantId: account.tenantId,
  }
  await publishEvent(Event.ACCOUNT_VERIFIED, properties)
}

export default {
  created,
  deleted,
  verified,
}
