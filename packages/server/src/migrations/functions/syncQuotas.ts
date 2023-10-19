import { runQuotaMigration } from "./usageQuotas"
import * as syncApps from "./usageQuotas/syncApps"
import * as syncRows from "./usageQuotas/syncRows"
import * as syncPlugins from "./usageQuotas/syncPlugins"
import * as syncUsers from "./usageQuotas/syncUsers"
import * as syncCreators from "./usageQuotas/syncCreators"

/**
 * Synchronise quotas to the state of the db.
 */
export const run = async () => {
  await runQuotaMigration(async () => {
    await syncApps.run()
    await syncRows.run()
    await syncPlugins.run()
    await syncUsers.run()
    await syncCreators.run()
  })
}
