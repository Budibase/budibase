import { processEvent } from "../events"
import { Event, Account } from "@budibase/types"

export function created(account: Account) {
  const properties = {}
  processEvent(Event.ACCOUNT_CREATED, properties)
}

export function deleted(account: Account) {
  const properties = {}
  processEvent(Event.ACCOUNT_DELETED, properties)
}

export function verified(account: Account) {
  const properties = {}
  processEvent(Event.ACCOUNT_VERIFIED, properties)
}
