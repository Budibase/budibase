const { createUserBuildersView } = require("@budibase/backend-core/db")
import * as syncDevelopers from "./usageQuotas/syncDevelopers"

/**
 * Date:
 * March 2022
 *
 * Description:
 * Create the builder users view and sync the developer count
 */

export const run = async (db: any) => {
  await createUserBuildersView(db)
  await syncDevelopers.run()
}
