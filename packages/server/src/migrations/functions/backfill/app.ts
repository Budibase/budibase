import * as app from "./app/app"

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill app events.
 */

export const run = async (appDb: any) => {
  await app.backfill(appDb)
}
