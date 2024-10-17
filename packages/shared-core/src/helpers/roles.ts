import { Role, DocumentType, SEPARATOR } from "@budibase/types"

// need to have a way to prefix, so we can check if the ID has its prefix or not
// all new IDs should be the same in the future, but old roles they are never prefixed
// while the role IDs always are - best to check both, also we can't access backend-core here
function prefixForCheck(id: string) {
  return `${DocumentType.ROLE}${SEPARATOR}${id}`
}

// Function to detect loops in roles
export function checkForRoleInheritanceLoops(roles: Role[]): boolean {
  const roleMap = new Map<string, Role>()
  roles.forEach(role => {
    roleMap.set(role._id!, role)
  })

  const checked = new Set<string>()
  const checking = new Set<string>()

  function hasLoop(roleId: string): boolean {
    const prefixed = prefixForCheck(roleId)
    if (checking.has(roleId) || checking.has(prefixed)) {
      return true
    }
    if (checked.has(roleId) || checked.has(prefixed)) {
      return false
    }

    checking.add(roleId)

    const role = roleMap.get(prefixed) || roleMap.get(roleId)
    if (!role) {
      // role not found - ignore
      checking.delete(roleId)
      return false
    }

    const inherits = Array.isArray(role.inherits)
      ? role.inherits
      : [role.inherits]
    for (const inheritedId of inherits) {
      if (inheritedId && hasLoop(inheritedId)) {
        return true
      }
    }

    // mark this role has been fully checked
    checking.delete(roleId)
    checked.add(roleId)

    return false
  }

  return !!roles.find(role => hasLoop(role._id!))
}
