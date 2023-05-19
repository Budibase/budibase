import { generator } from "@budibase/backend-core/tests"
import { db } from "@budibase/backend-core"
import { UserGroupRoles } from "@budibase/types"

export const UserGroup = () => {
  const appsCount = generator.integer({ min: 0, max: 3 })
  const roles = Array.from({ length: appsCount }).reduce(
    (p: UserGroupRoles, v) => {
      return {
        ...p,
        [db.generateAppID()]: generator.pickone(["ADMIN", "POWER", "BASIC"]),
      }
    },
    {}
  )

  let group = {
    apps: [],
    color: generator.color(),
    icon: generator.word(),
    name: generator.word(),
    roles: roles,
    users: [],
  }
  return group
}
