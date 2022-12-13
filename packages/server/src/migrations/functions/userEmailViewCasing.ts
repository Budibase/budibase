import { db as dbCore } from "@budibase/backend-core"

/**
 * Date:
 * October 2021
 *
 * Description:
 * Recreate the user email view to include latest changes i.e. lower casing the email address
 */

export const run = async () => {
  await dbCore.createNewUserEmailView()
}
