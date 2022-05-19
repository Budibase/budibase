import * as apps from "./app/apps"
import * as automations from "./app/automations"
import * as datasources from "./app/datasources"
import * as layouts from "./app/layouts"
import * as queries from "./app/queries"
import * as roles from "./app/roles"
import * as tables from "./app/tables"

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill app events.
 */

export const run = async (appDb: any) => {
  await apps.backfill(appDb)
  await automations.backfill(appDb)
  await datasources.backfill(appDb)
  await layouts.backfill(appDb)
  await queries.backfill(appDb)
  await roles.backfill(appDb)
  await tables.backfill(appDb)
}
