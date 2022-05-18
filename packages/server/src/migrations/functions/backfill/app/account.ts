// TODO: Add migrations to account portal

import { events, db } from "@budibase/backend-core"
import { Account } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const accounts: Account[] = []

  for (const account of accounts) {
    events.account.created(account)

    if (account.verified) {
      events.account.verified(account)
    }
  }
}
