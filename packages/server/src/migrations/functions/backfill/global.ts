import * as users from "./global/users"
import * as rows from "./global/rows"
import * as configs from "./global/configs"
import { tenancy, events, migrations } from "@budibase/backend-core"

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

  await events.identification.identifyTenant(tenantId, installTimestamp)
  await configs.backfill(db, installTimestamp)

  // users and rows provide their own timestamp
  await users.backfill(db)
  await rows.backfill()
}

export const isComplete = async (): Promise<boolean> => {
  const globalDb = tenancy.getGlobalDB()
  const migrationsDoc = await migrations.getMigrationsDoc(globalDb)
  return !!migrationsDoc.event_global_backfill
}

const getInstallTimestamp = async (db: any): Promise<number | undefined> => {
  const allUsers = await users.getUsers(db)

  // get the olders user timestamp
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
