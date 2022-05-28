import * as users from "./global/users"
import * as rows from "./global/rows"
import * as configs from "./global/configs"
import { tenancy, events, migrations, accounts } from "@budibase/backend-core"
import { CloudAccount } from "@budibase/types"
import env from "../../../environment"

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill global events.
 */

export const run = async (db: any) => {
  const tenantId = tenancy.getTenantId()
  const installTimestamp = (await getInstallTimestamp(db)) as number
  let account: CloudAccount | undefined
  if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
    account = await accounts.getAccountByTenantId(tenantId)
  }

  await events.identification.identifyTenantGroup(
    tenantId,
    account,
    installTimestamp
  )
  await configs.backfill(db, installTimestamp)

  // users and rows provide their own timestamp
  await users.backfill(db, account)
  await rows.backfill()
}

export const isComplete = async (): Promise<boolean> => {
  const globalDb = tenancy.getGlobalDB()
  const migrationsDoc = await migrations.getMigrationsDoc(globalDb)
  return !!migrationsDoc.event_global_backfill
}

export const getInstallTimestamp = async (
  globalDb: any
): Promise<number | undefined> => {
  const allUsers = await users.getUsers(globalDb)

  // get the oldest user timestamp
  const timestamps = allUsers
    .map(user => user.createdAt)
    .filter(timestamp => !!timestamp)
    .sort(
      (a, b) =>
        new Date(a as number).getTime() - new Date(b as number).getTime()
    )

  if (timestamps.length) {
    return timestamps[0]
  }
}
