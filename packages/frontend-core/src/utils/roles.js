import { Roles } from "../constants"

const RolePriorities = {
  [Roles.ADMIN]: 4,
  [Roles.POWER]: 3,
  [Roles.BASIC]: 2,
  [Roles.PUBLIC]: 1,
}
const RoleColours = {
  [Roles.ADMIN]: "var(--spectrum-global-color-static-red-400)",
  [Roles.POWER]: "var(--spectrum-global-color-static-orange-400)",
  [Roles.BASIC]: "var(--spectrum-global-color-static-green-400)",
  [Roles.PUBLIC]: "var(--spectrum-global-color-static-blue-400)",
}

export const getRolePriority = roleId => {
  return RolePriorities[roleId] ?? 0
}

export const getRoleColour = roleId => {
  return (
    RoleColours[roleId] ?? "var(--spectrum-global-color-static-magenta-400)"
  )
}
