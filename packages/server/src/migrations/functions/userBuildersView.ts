const { createUserBuildersView } = require("@budibase/backend-core/db")

/**
 * Date:
 * March 2022
 *
 * Description:
 * Create the builder users view.
 */

export const run = async (db: any) => {
  await createUserBuildersView(db)
}
