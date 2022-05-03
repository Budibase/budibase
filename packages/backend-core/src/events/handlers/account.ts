import { processEvent } from "../events"
import { Events, Account } from "@budibase/types"

export function created(account: Account) {
  const properties = {}
  processEvent(Events.ACCOUNT_CREATED, properties)
}

export function deleted(account: Account) {
  const properties = {}
  processEvent(Events.ACCOUNT_DELETED, properties)
}

export function verified(account: Account) {
  const properties = {}
  processEvent(Events.ACCOUNT_VERIFIED, properties)
}
