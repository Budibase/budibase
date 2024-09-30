import { Role } from "@budibase/types"

// Function to detect loops in roles
export function checkForRoleInheritanceLoops(roles: Role[]): boolean {
  const roleMap = new Map<string, Role>()
  roles.forEach(role => {
    roleMap.set(role._id!, role)
  })

  const checked = new Set<string>()
  const checking = new Set<string>()

  function hasLoop(roleId: string): boolean {
    if (checking.has(roleId)) {
      return true
    }
    if (checked.has(roleId)) {
      return false
    }

    checking.add(roleId)

    const role = roleMap.get(roleId)
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
