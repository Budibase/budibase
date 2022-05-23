import { publishEvent } from "../events"
import { Event, Account } from "@budibase/types"

export async function created(account: Account) {
  const properties = {}
  await publishEvent(Event.ACCOUNT_CREATED, properties)
}

export async function deleted(account: Account) {
  const properties = {}
  await publishEvent(Event.ACCOUNT_DELETED, properties)
}

export async function verified(account: Account) {
  const properties = {}
  await publishEvent(Event.ACCOUNT_VERIFIED, properties)
}
