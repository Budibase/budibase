import { runQuotaMigration } from "./usageQuotas"
import * as syncApps from "./usageQuotas/syncApps"
import * as syncRows from "./usageQuotas/syncRows"
import * as syncPlugins from "./usageQuotas/syncPlugins"

/**
 * Synchronise quotas to the state of the db.
 */
export const run = async () => {
  await runQuotaMigration(async () => {
    await syncApps.run()
    await syncRows.run()
    await syncPlugins.run()
  })
}
