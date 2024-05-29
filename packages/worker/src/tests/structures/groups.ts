import { generator } from "@budibase/backend-core/tests"
import { db } from "@budibase/backend-core"
import { UserGroup as UserGroupType, UserGroupRoles } from "@budibase/types"

export function UserGroup(): UserGroupType {
  const appsCount = generator.integer({ min: 0, max: 3 })
  const roles = Array.from({ length: appsCount }).reduce(
    (p: UserGroupRoles) => {
      return {
        ...p,
        [db.generateAppID()]: generator.pickone(["ADMIN", "POWER", "BASIC"]),
      }
    },
    {}
  )

  return {
    color: generator.color(),
    icon: generator.word(),
    name: generator.word(),
    roles: roles,
    users: [],
  }
}
