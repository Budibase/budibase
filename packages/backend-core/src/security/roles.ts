import { BuiltinPermissionID, PermissionLevel } from "./permissions"
import {
  prefixRoleID,
  getRoleParams,
  DocumentType,
  SEPARATOR,
  doWithDB,
} from "../db"
import { getAppDB } from "../context"
import { Screen, Role as RoleDoc, RoleUIMetadata } from "@budibase/types"
import cloneDeep from "lodash/fp/cloneDeep"
import { RoleColor, helpers } from "@budibase/shared-core"

export const BUILTIN_ROLE_IDS = {
  ADMIN: "ADMIN",
  POWER: "POWER",
  BASIC: "BASIC",
  PUBLIC: "PUBLIC",
}

const BUILTIN_IDS = {
  ...BUILTIN_ROLE_IDS,
  BUILDER: "BUILDER",
}

// exclude internal roles like builder
const EXTERNAL_BUILTIN_ROLE_IDS = [
  BUILTIN_IDS.ADMIN,
  BUILTIN_IDS.POWER,
  BUILTIN_IDS.BASIC,
  BUILTIN_IDS.PUBLIC,
]

export const RoleIDVersion = {
  // original version, with a UUID based ID
  UUID: undefined,
  // new version - with name based ID
  NAME: "name",
}

export class Role implements RoleDoc {
  _id: string
  _rev?: string
  name: string
  permissionId: string
  inherits?: string | string[]
  version?: string
  permissions: Record<string, PermissionLevel[]> = {}
  uiMetadata?: RoleUIMetadata

  constructor(
    id: string,
    name: string,
    permissionId: string,
    uiMetadata?: RoleUIMetadata
  ) {
    this._id = id
    this.name = name
    this.uiMetadata = uiMetadata
    this.permissionId = permissionId
    // version for managing the ID - removing the role_ when responding
    this.version = RoleIDVersion.NAME
  }

  addInheritance(inherits?: string | string[]) {
    if (inherits) {
      this.inherits = inherits
    }
    return this
  }
}

const BUILTIN_ROLES = {
  ADMIN: new Role(
    BUILTIN_IDS.ADMIN,
    BUILTIN_IDS.ADMIN,
    BuiltinPermissionID.ADMIN,
    {
      displayName: "App admin",
      description: "Can do everything",
      color: RoleColor.ADMIN,
    }
  ).addInheritance(BUILTIN_IDS.POWER),
  POWER: new Role(
    BUILTIN_IDS.POWER,
    BUILTIN_IDS.POWER,
    BuiltinPermissionID.POWER,
    {
      displayName: "App power user",
      description: "An app user with more access",
      color: RoleColor.POWER,
    }
  ).addInheritance(BUILTIN_IDS.BASIC),
  BASIC: new Role(
    BUILTIN_IDS.BASIC,
    BUILTIN_IDS.BASIC,
    BuiltinPermissionID.WRITE,
    {
      displayName: "App user",
      description: "Any logged in user",
      color: RoleColor.BASIC,
    }
  ).addInheritance(BUILTIN_IDS.PUBLIC),
  PUBLIC: new Role(
    BUILTIN_IDS.PUBLIC,
    BUILTIN_IDS.PUBLIC,
    BuiltinPermissionID.PUBLIC,
    {
      displayName: "Public user",
      description: "Accessible to anyone",
      color: RoleColor.PUBLIC,
    }
  ),
  BUILDER: new Role(
    BUILTIN_IDS.BUILDER,
    BUILTIN_IDS.BUILDER,
    BuiltinPermissionID.ADMIN,
    {
      displayName: "Builder user",
      description: "Users that can edit this app",
      color: RoleColor.BUILDER,
    }
  ),
}

export function getBuiltinRoles(): { [key: string]: RoleDoc } {
  return cloneDeep(BUILTIN_ROLES)
}

export function isBuiltin(role: string) {
  return getBuiltinRole(role) !== undefined
}

export function getBuiltinRole(roleId: string): Role | undefined {
  const role = Object.values(BUILTIN_ROLES).find(role =>
    roleId.includes(role._id)
  )
  if (!role) {
    return undefined
  }
  return cloneDeep(role)
}

/**
 * Works through the inheritance ranks to see how far up the builtin stack this ID is.
 */
export function builtinRoleToNumber(id: string) {
  const builtins = getBuiltinRoles()
  const MAX = Object.values(builtins).length + 1
  if (id === BUILTIN_IDS.ADMIN || id === BUILTIN_IDS.BUILDER) {
    return MAX
  }
  let role = builtins[id],
    count = 0
  do {
    if (!role) {
      break
    }
    if (Array.isArray(role.inherits)) {
      throw new Error("Built-in roles don't support multi-inheritance")
    } else {
      role = builtins[role.inherits!]
    }
    count++
  } while (role !== null)
  return count
}

/**
 * Converts any role to a number, but has to be async to get the roles from db.
 */
export async function roleToNumber(id: string) {
  if (isBuiltin(id)) {
    return builtinRoleToNumber(id)
  }
  const hierarchy = (await getUserRoleHierarchy(id, {
    defaultPublic: true,
  })) as RoleDoc[]
  const findNumber = (role: RoleDoc): number => {
    if (!role.inherits) {
      return 0
    }
    if (Array.isArray(role.inherits)) {
      // find the built-in roles, get their number, sort it, then get the last one
      const highestBuiltin: number | undefined = role.inherits
        .map(roleId => {
          const foundRole = hierarchy.find(role => role._id === roleId)
          if (foundRole) {
            return findNumber(foundRole) + 1
          }
        })
        .filter(number => !!number)
        .sort()
        .pop()
      if (highestBuiltin != undefined) {
        return highestBuiltin
      }
    } else if (isBuiltin(role.inherits)) {
      return builtinRoleToNumber(role.inherits) + 1
    }
    return 0
  }
  let highest = 0
  for (let role of hierarchy) {
    const roleNumber = findNumber(role)
    highest = Math.max(roleNumber, highest)
  }
  return highest
}

/**
 * Returns whichever builtin roleID is lower.
 */
export function lowerBuiltinRoleID(roleId1?: string, roleId2?: string): string {
  if (!roleId1) {
    return roleId2 as string
  }
  if (!roleId2) {
    return roleId1 as string
  }
  return builtinRoleToNumber(roleId1) > builtinRoleToNumber(roleId2)
    ? roleId2
    : roleId1
}

/**
 * Given a list of roles, this will pick the role out, accounting for built ins.
 */
export function findRole(
  roleId: string,
  roles: RoleDoc[],
  opts?: { defaultPublic?: boolean }
): RoleDoc {
  // built in roles mostly come from the in-code implementation,
  // but can be extended by a doc stored about them (e.g. permissions)
  let role: RoleDoc | undefined = getBuiltinRole(roleId)
  if (!role) {
    // make sure has the prefix (if it has it then it won't be added)
    roleId = prefixRoleID(roleId)
  }
  const dbRole = roles.find(
    role => role._id && role._id === getExternalRoleID(roleId, role.version)
  )
  if (!dbRole && !isBuiltin(roleId) && opts?.defaultPublic) {
    return cloneDeep(BUILTIN_ROLES.PUBLIC)
  }
  if (!dbRole && (!role || Object.keys(role).length === 0)) {
    throw new Error("Role could not be found")
  }
  role = Object.assign(role || {}, dbRole)
  // finalise the ID
  role._id = getExternalRoleID(role._id!, role.version)
  return role
}

/**
 * Gets the role object, this is mainly useful for two purposes, to check if the level exists and
 * to check if the role inherits any others.
 * @param roleId The level ID to lookup.
 * @param opts options for the function, like whether to halt errors, instead return public.
 * @returns The role object, which may contain an "inherits" property.
 */
export async function getRole(
  roleId: string,
  opts?: { defaultPublic?: boolean }
): Promise<RoleDoc> {
  const db = getAppDB()
  const roleList = []
  if (!isBuiltin(roleId)) {
    const role = await db.tryGet<RoleDoc>(getDBRoleID(roleId))
    if (role) {
      roleList.push(role)
    }
  }
  return findRole(roleId, roleList, opts)
}

/**
 * Simple function to get all the roles based on the top level user role ID.
 */
async function getAllUserRoles(
  userRoleId: string,
  opts?: { defaultPublic?: boolean }
): Promise<RoleDoc[]> {
  const allRoles = await getAllRoles()
  if (helpers.roles.checkForRoleInheritanceLoops(allRoles)) {
    throw new Error("Loop detected in roles - cannot list roles")
  }
  // admins have access to all roles
  if (userRoleId === BUILTIN_IDS.ADMIN) {
    return allRoles
  }
  const rolesFound = (ids: string | string[]) => {
    if (Array.isArray(ids)) {
      return ids.filter(id => roleIds.includes(id)).length === ids.length
    } else {
      return roleIds.includes(ids)
    }
  }

  const roleIds = [userRoleId]
  const roles: RoleDoc[] = []
  const iterateInherited = (role: RoleDoc) => {
    if (!role || !role._id) {
      return
    }
    roleIds.push(role._id)
    roles.push(role)
    if (Array.isArray(role.inherits)) {
      role.inherits.forEach(roleId => {
        const foundRole = findRole(roleId, allRoles, opts)
        if (foundRole) {
          iterateInherited(foundRole)
        }
      })
    } else {
      while (role && role.inherits && !rolesFound(role.inherits)) {
        if (Array.isArray(role.inherits)) {
          iterateInherited(role)
          break
        } else {
          roleIds.push(role.inherits)
          role = findRole(role.inherits, allRoles, opts)
          if (role) {
            roles.push(role)
          }
        }
      }
    }
  }

  // get all the inherited roles
  iterateInherited(findRole(userRoleId, allRoles, opts))
  const foundRoleIds: string[] = []
  return roles.filter(role => {
    if (role._id && !foundRoleIds.includes(role._id)) {
      foundRoleIds.push(role._id)
      return true
    } else {
      return false
    }
  })
}

export async function getUserRoleIdHierarchy(
  userRoleId: string
): Promise<string[]> {
  const roles = await getUserRoleHierarchy(userRoleId)
  return roles.map(role => role._id!)
}

/**
 * Returns an ordered array of the user's inherited role IDs, this can be used
 * to determine if a user can access something that requires a specific role.
 * @param userRoleId The user's role ID, this can be found in their access token.
 * @param opts optional - if want to default to public use this.
 * @returns returns an ordered array of the roles, with the first being their
 * highest level of access and the last being the lowest level.
 */
export async function getUserRoleHierarchy(
  userRoleId: string,
  opts?: { defaultPublic?: boolean }
) {
  // special case, if they don't have a role then they are a public user
  return getAllUserRoles(userRoleId, opts)
}

// this function checks that the provided permissions are in an array format
// some templates/older apps will use a simple string instead of array for roles
// convert the string to an array using the theory that write is higher than read
export function checkForRoleResourceArray(
  rolePerms: Record<string, PermissionLevel[]>,
  resourceId: string
): Record<string, PermissionLevel[]> {
  if (rolePerms && !Array.isArray(rolePerms[resourceId])) {
    const permLevel = rolePerms[resourceId] as any
    rolePerms[resourceId] = [permLevel]
    if (permLevel === PermissionLevel.WRITE) {
      rolePerms[resourceId].push(PermissionLevel.READ)
    }
  }
  return rolePerms
}

export async function getAllRoleIds(appId: string): Promise<string[]> {
  const roles = await getAllRoles(appId)
  return roles.map(role => role._id!)
}

/**
 * Given an app ID this will retrieve all of the roles that are currently within that app.
 * @return An array of the role objects that were found.
 */
export async function getAllRoles(appId?: string): Promise<RoleDoc[]> {
  if (appId) {
    return doWithDB(appId, internal)
  } else {
    let appDB
    try {
      appDB = getAppDB()
    } catch (error) {
      // We don't have any apps, so we'll just use the built-in roles
    }
    return internal(appDB)
  }
  async function internal(db: any) {
    let roles: RoleDoc[] = []
    if (db) {
      const body = await db.allDocs(
        getRoleParams(null, {
          include_docs: true,
        })
      )
      roles = body.rows.map((row: any) => row.doc)
      roles.forEach(
        role => (role._id = getExternalRoleID(role._id!, role.version))
      )
    }
    const builtinRoles = getBuiltinRoles()

    // need to combine builtin with any DB record of them (for sake of permissions)
    for (let builtinRoleId of EXTERNAL_BUILTIN_ROLE_IDS) {
      const builtinRole = builtinRoles[builtinRoleId]
      const dbBuiltin = roles.filter(
        dbRole =>
          getExternalRoleID(dbRole._id!, dbRole.version) === builtinRoleId
      )[0]
      if (dbBuiltin == null) {
        roles.push(builtinRole || builtinRoles.BASIC)
      } else {
        // remove role and all back after combining with the builtin
        roles = roles.filter(role => role._id !== dbBuiltin._id)
        dbBuiltin._id = getExternalRoleID(dbBuiltin._id!, dbBuiltin.version)
        roles.push(Object.assign(builtinRole, dbBuiltin))
      }
    }
    // check permissions
    for (let role of roles) {
      if (!role.permissions) {
        continue
      }
      for (let resourceId of Object.keys(role.permissions)) {
        role.permissions = checkForRoleResourceArray(
          role.permissions,
          resourceId
        )
      }
    }
    return roles
  }
}

export class AccessController {
  userHierarchies: { [key: string]: string[] }
  constructor() {
    this.userHierarchies = {}
  }

  async hasAccess(tryingRoleId?: string, userRoleId?: string) {
    // special cases, the screen has no role, the roles are the same or the user
    // is currently in the builder
    if (
      tryingRoleId == null ||
      tryingRoleId === "" ||
      tryingRoleId === userRoleId ||
      tryingRoleId === BUILTIN_IDS.BUILDER ||
      userRoleId === BUILTIN_IDS.BUILDER
    ) {
      return true
    }
    let roleIds = userRoleId ? this.userHierarchies[userRoleId] : null
    if (!roleIds && userRoleId) {
      roleIds = await getUserRoleIdHierarchy(userRoleId)
      this.userHierarchies[userRoleId] = roleIds
    }

    return roleIds?.indexOf(tryingRoleId) !== -1
  }

  async checkScreensAccess(screens: Screen[], userRoleId: string) {
    let accessibleScreens = []
    // don't want to handle this with Promise.all as this would mean all custom roles would be
    // retrieved at same time, it is likely a custom role will be re-used and therefore want
    // to work in sync for performance save
    for (let screen of screens) {
      const accessible = await this.checkScreenAccess(screen, userRoleId)
      if (accessible) {
        accessibleScreens.push(accessible)
      }
    }
    return accessibleScreens
  }

  async checkScreenAccess(screen: Screen, userRoleId: string) {
    const roleId = screen && screen.routing ? screen.routing.roleId : undefined
    if (await this.hasAccess(roleId, userRoleId)) {
      return screen
    }
    return null
  }
}

/**
 * Adds the "role_" for builtin role IDs which are to be written to the DB (for permissions).
 */
export function getDBRoleID(roleName: string) {
  if (roleName?.startsWith(DocumentType.ROLE)) {
    return roleName
  }
  return prefixRoleID(roleName)
}

/**
 * Remove the "role_" from builtin role IDs that have been written to the DB (for permissions).
 */
export function getExternalRoleID(roleId: string, version?: string) {
  // for built-in roles we want to remove the DB role ID element (role_)
  if (
    roleId.startsWith(`${DocumentType.ROLE}${SEPARATOR}`) &&
    (isBuiltin(roleId) || version === RoleIDVersion.NAME)
  ) {
    const parts = roleId.split(SEPARATOR)
    parts.shift()
    return parts.join(SEPARATOR)
  }
  return roleId
}
