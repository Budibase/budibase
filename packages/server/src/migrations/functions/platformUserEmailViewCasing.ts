const { createPlatformUserView } = require("@budibase/backend-core/db")

/**
 * Date:
 * September 2022
 *
 * Description:
 * Create a view in platform DB with lowercase emails for all users.
 */

export const run = async () => {
  await createPlatformUserView()
}
