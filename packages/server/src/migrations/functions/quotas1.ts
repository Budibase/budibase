import { runQuotaMigration } from "./usageQuotas"
import * as syncApps from "./usageQuotas/syncApps"
import * as syncRows from "./usageQuotas/syncRows"

/**
 * Date:
 * January 2022
 *
 * Description:
 * Synchronise the app and row quotas to the state of the db after it was
 * discovered that the quota resets were still in place and the row quotas
 * weren't being decremented correctly.
 */

export const run = async () => {
  await runQuotaMigration(async () => {
    await syncApps.run()
    await syncRows.run()
  })
}
