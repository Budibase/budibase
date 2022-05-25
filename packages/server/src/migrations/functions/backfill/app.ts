import * as automations from "./app/automations"
import * as datasources from "./app/datasources"
import * as layouts from "./app/layouts"
import * as queries from "./app/queries"
import * as roles from "./app/roles"
import * as tables from "./app/tables"
import * as screens from "./app/screens"
import * as global from "./global"
import { App } from "@budibase/types"
import { db as dbUtils, events } from "@budibase/backend-core"

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

  const app: App = await appDb.get(dbUtils.DocumentTypes.APP_METADATA)
  const timestamp = app.createdAt as string

  if (dbUtils.isDevAppID(app.appId)) {
    await events.app.created(app, timestamp)
    await automations.backfill(appDb, timestamp)
    await datasources.backfill(appDb, timestamp)
    await layouts.backfill(appDb, timestamp)
    await queries.backfill(appDb, timestamp)
    await roles.backfill(appDb, timestamp)
    await tables.backfill(appDb, timestamp)
    await screens.backfill(appDb, timestamp)
  }

  if (dbUtils.isProdAppID(app.appId)) {
    await events.app.published(app, timestamp)
  }
}
