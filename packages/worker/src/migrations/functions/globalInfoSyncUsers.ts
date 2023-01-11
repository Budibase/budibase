import { User } from "@budibase/types"
import sdk from "../../sdk"

/**
 * Date:
 * Aug 2022
 *
 * Description:
 * Re-sync the global-db users to the global-info db users
 */
export const run = async (globalDb: any) => {
  const users = (await sdk.users.allUsers()) as User[]
  const promises = []
  for (let user of users) {
    promises.push(
      sdk.users.addTenant(user.tenantId, user._id as string, user.email)
    )
  }
  await Promise.all(promises)
}
