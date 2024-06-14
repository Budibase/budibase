import { BuiltInRole } from "@budibase/types"

const RolePriorities = {
  [BuiltInRole.ADMIN]: 5,
  [BuiltInRole.CREATOR]: 4,
  [BuiltInRole.POWER]: 3,
  [BuiltInRole.BASIC]: 2,
  [BuiltInRole.PUBLIC]: 1,
}
const RoleColours = {
  [BuiltInRole.ADMIN]: "var(--spectrum-global-color-static-red-400)",
  [BuiltInRole.CREATOR]: "var(--spectrum-global-color-static-magenta-600)",
  [BuiltInRole.POWER]: "var(--spectrum-global-color-static-orange-400)",
  [BuiltInRole.BASIC]: "var(--spectrum-global-color-static-green-400)",
  [BuiltInRole.PUBLIC]: "var(--spectrum-global-color-static-blue-400)",
}

export const getRolePriority = role => {
  return RolePriorities[role] ?? 0
}

export const getRoleColour = roleId => {
  return (
    RoleColours[roleId] ?? "var(--spectrum-global-color-static-magenta-400)"
  )
}
