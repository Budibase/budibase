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
  await events.identification.identifyTenant(tenantId)

  await users.backfill(db)
  await rows.backfill()
  await configs.backfill(db)
}

export const isComplete = async (): Promise<boolean> => {
  const globalDb = tenancy.getGlobalDB()
  const migrationsDoc = await migrations.getMigrationsDoc(globalDb)
  return !!migrationsDoc.event_global_backfill
}
