import { Roles } from "../constants"

const RolePriorities = {
  [Roles.ADMIN]: 5,
  [Roles.CREATOR]: 4,
  [Roles.POWER]: 3,
  [Roles.BASIC]: 2,
  [Roles.PUBLIC]: 1,
}

export const getRolePriority = role => {
  return RolePriorities[role] ?? 0
}
