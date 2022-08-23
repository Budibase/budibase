const { createNewUserEmailView } = require("@budibase/backend-core/db")

/**
 * Date:
 * October 2021
 *
 * Description:
 * Recreate the user email view to include latest changes i.e. lower casing the email address
 */

export const run = async (db: any) => {
  await createNewUserEmailView(db)
}
