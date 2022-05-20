import * as users from "./global/users"
import * as rows from "./global/rows"
import * as configs from "./global/configs"

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill global events.
 */

export const run = async (db: any) => {
  await users.backfill(db)
  await rows.backfill()
  await configs.backfill(db)
}
