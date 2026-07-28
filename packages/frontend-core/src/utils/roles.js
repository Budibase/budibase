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

const normalizeRoleId = id => String(id || "").replace(/^role_/, "")

// True if `roleId` reaches `targetRoleId` by walking its inheritance chain
// (or equals it). Ids may appear with or without the "role_" doc prefix.
export const roleInherits = (
  roleId,
  targetRoleId,
  rolesById,
  seen = new Set()
) => {
  if (normalizeRoleId(roleId) === normalizeRoleId(targetRoleId)) {
    return true
  }
  if (seen.has(roleId)) {
    return false
  }
  seen.add(roleId)
  const role = rolesById[roleId] || rolesById[normalizeRoleId(roleId)]
  const inherits = [].concat(role?.inherits || [])
  return inherits.some(parent =>
    roleInherits(parent, targetRoleId, rolesById, seen)
  )
}

// True if `roleId` may be assigned under a parent requiring `parentRoleId`:
// it inherits or equals the parent, or is ADMIN (the super-role that can
// access every resource).
export const isRoleAtLeastAsRestrictive = (roleId, parentRoleId, roles) => {
  const rolesById = Object.fromEntries(roles.map(r => [r._id, r]))
  return (
    normalizeRoleId(roleId) === Roles.ADMIN ||
    roleInherits(roleId, parentRoleId, rolesById)
  )
}

// Ids of the roles that are at least as restrictive as `parentRoleId` (their
// audience is a subset of the parent's). Used to constrain which roles a child
// resource may be assigned so it can never be visible to someone who cannot
// see its parent.
export const getRolesAtLeastAsRestrictive = (parentRoleId, roles) =>
  roles
    .filter(r => isRoleAtLeastAsRestrictive(r._id, parentRoleId, roles))
    .map(r => r._id)
