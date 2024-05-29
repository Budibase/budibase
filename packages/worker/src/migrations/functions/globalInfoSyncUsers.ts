import { User } from "@budibase/types"
import * as usersSdk from "../../sdk/users"
import { platform } from "@budibase/backend-core"

/**
 * Date:
 * Aug 2022
 *
 * Description:
 * Re-sync the global-db users to the global-info db users
 */
export const run = async () => {
  const users = (await usersSdk.db.allUsers()) as User[]
  const promises = []
  for (let user of users) {
    promises.push(
      platform.users.addUser(user.tenantId, user._id as string, user.email)
    )
  }
  await Promise.all(promises)
}
