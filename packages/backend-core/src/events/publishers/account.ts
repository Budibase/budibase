import { publishEvent } from "../events"
import { Event, Account } from "@budibase/types"

export function created(account: Account) {
  const properties = {}
  publishEvent(Event.ACCOUNT_CREATED, properties)
}

export function deleted(account: Account) {
  const properties = {}
  publishEvent(Event.ACCOUNT_DELETED, properties)
}

export function verified(account: Account) {
  const properties = {}
  publishEvent(Event.ACCOUNT_VERIFIED, properties)
}
