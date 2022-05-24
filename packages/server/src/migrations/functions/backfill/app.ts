import * as apps from "./app/apps"
import * as automations from "./app/automations"
import * as datasources from "./app/datasources"
import * as layouts from "./app/layouts"
import * as queries from "./app/queries"
import * as roles from "./app/roles"
import * as tables from "./app/tables"
import * as screens from "./app/screens"
import * as global from "./global"

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill app events.
 */

export const run = async (appDb: any) => {
  if (await global.isComplete()) {
    // make sure new apps aren't backfilled
    // return if the global migration for this tenant is complete
    // which runs after the app migrations
    return
  }

  await apps.backfill(appDb)
  await automations.backfill(appDb)
  await datasources.backfill(appDb)
  await layouts.backfill(appDb)
  await queries.backfill(appDb)
  await roles.backfill(appDb)
  await tables.backfill(appDb)
  await screens.backfill(appDb)
}
