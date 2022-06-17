import * as syncPublishedApps from "./usageQuotas/syncPublishedApps"

/**
 * Date:
 * March 2022
 *
 * Description:
 * Sync the published apps count
 */

export const run = async (db: any) => {
  await syncPublishedApps.run()
}
