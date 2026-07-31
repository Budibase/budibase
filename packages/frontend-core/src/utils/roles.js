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

// The roles API externalises a role's _id without its version but its
// `inherits` with it, so the same role can arrive with a prefixed _id and
// unprefixed parents. Look a role up under every spelling rather than assuming
// how the caller keyed its index.
const findRole = (rolesById, id) => {
  const bare = normalizeRoleId(id)
  return rolesById[id] || rolesById[bare] || rolesById[`role_${bare}`]
}

const indexRoles = roles => Object.fromEntries(roles.map(r => [r._id, r]))

// True if `roleId` reaches `targetRoleId` by walking its inheritance chain
// (or equals it). Ids may appear with or without the "role_" doc prefix.
export const roleInherits = (
  roleId,
  targetRoleId,
  rolesById,
  seen = new Set()
) => {
  const bare = normalizeRoleId(roleId)
  if (bare === normalizeRoleId(targetRoleId)) {
    return true
  }
  // Track the normalised id so two spellings of one role can't be walked twice.
  if (seen.has(bare)) {
    return false
  }
  seen.add(bare)
  const inherits = [].concat(findRole(rolesById, roleId)?.inherits || [])
  return inherits.some(parent =>
    roleInherits(parent, targetRoleId, rolesById, seen)
  )
}

// True if `roleId` may be assigned under a parent requiring `parentRoleId`:
// it inherits or equals the parent, or is ADMIN (the super-role that can
// access every resource).
export const isRoleAtLeastAsRestrictive = (roleId, parentRoleId, roles) =>
  normalizeRoleId(roleId) === Roles.ADMIN ||
  roleInherits(roleId, parentRoleId, indexRoles(roles))

// Ids of the roles that are at least as restrictive as `parentRoleId` (their
// audience is a subset of the parent's). Used to constrain which roles a child
// resource may be assigned so it can never be visible to someone who cannot
// see its parent.
export const getRolesAtLeastAsRestrictive = (parentRoleId, roles) => {
  const rolesById = indexRoles(roles)
  return roles
    .filter(
      r =>
        normalizeRoleId(r._id) === Roles.ADMIN ||
        roleInherits(r._id, parentRoleId, rolesById)
    )
    .map(r => r._id)
}
