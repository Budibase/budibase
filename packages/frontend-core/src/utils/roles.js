import { Roles } from "../constants"

const RolePriorities = {
  [Roles.ADMIN]: 4,
  [Roles.POWER]: 3,
  [Roles.BASIC]: 2,
  [Roles.PUBLIC]: 1,
}
const RoleColours = {
  [Roles.ADMIN]: "var(--spectrum-global-color-static-seafoam-400)",
  [Roles.POWER]: "var(--spectrum-global-color-static-purple-400)",
  [Roles.BASIC]: "var(--spectrum-global-color-static-magenta-400)",
  [Roles.PUBLIC]: "var(--spectrum-global-color-static-yellow-400)",
}

export const getRolePriority = roleId => {
  return RolePriorities[roleId] ?? 0
}

export const getRoleColour = roleId => {
  return RoleColours[roleId] ?? "rgb(20, 115, 230)"
}
