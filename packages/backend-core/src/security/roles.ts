import semver from "semver"
import {
  prefixRoleID,
  getRoleParams,
  DocumentType,
  SEPARATOR,
  doWithDB,
} from "../db"
import { getAppDB } from "../context"
import {
  Screen,
  Role as RoleDoc,
  RoleUIMetadata,
  Database,
  App,
  BuiltinPermissionID,
  PermissionLevel,
} from "@budibase/types"
import cloneDeep from "lodash/fp/cloneDeep"
import { RoleColor, helpers } from "@budibase/shared-core"
import { uniqBy } from "lodash"
import { default as env } from "../environment"

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

export const RoleIDVersion = {
  // original version, with a UUID based ID
  UUID: undefined,
  // new version - with name based ID
  NAME: "name",
}

function rolesInList(roleIds: string[], ids: string | string[]) {
  if (Array.isArray(ids)) {
    return ids.filter(id => roleIds.includes(id)).length === ids.length
  } else {
    return roleIds.includes(ids)
  }
}

export class Role implements RoleDoc {
  _id: string
  _rev?: string
  name: string
  permissionId: BuiltinPermissionID
  inherits?: string | string[]
  version?: string
  permissions: Record<string, PermissionLevel[]> = {}
  uiMetadata?: RoleUIMetadata

  constructor(
    id: string,
    name: string,
    permissionId: BuiltinPermissionID,
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
    // make sure IDs are correct format
    if (inherits && typeof inherits === "string") {
      inherits = prefixRoleIDNoBuiltin(inherits)
    } else if (inherits && Array.isArray(inherits)) {
      inherits = inherits.map(prefixRoleIDNoBuiltin)
    }
    this.inherits = inherits
    return this
  }
}

export class RoleHierarchyTraversal {
  allRoles: RoleDoc[]
  opts?: { defaultPublic?: boolean }

  constructor(allRoles: RoleDoc[], opts?: { defaultPublic?: boolean }) {
    this.allRoles = allRoles
    this.opts = opts
  }

  walk(role: RoleDoc): RoleDoc[] {
    const opts = this.opts,
      allRoles = this.allRoles
    // this will be a full walked list of roles - which may contain duplicates
    let roleList: RoleDoc[] = []
    if (!role || !role._id) {
      return roleList
    }
    roleList.push(role)
    if (Array.isArray(role.inherits)) {
      for (let roleId of role.inherits) {
        const foundRole = findRole(roleId, allRoles, opts)
        if (foundRole) {
          roleList = roleList.concat(this.walk(foundRole))
        }
      }
    } else {
      const foundRoleIds: string[] = []
      let currentRole: RoleDoc | undefined = role
      while (
        currentRole &&
        currentRole.inherits &&
        !rolesInList(foundRoleIds, currentRole.inherits)
      ) {
        if (Array.isArray(currentRole.inherits)) {
          return roleList.concat(this.walk(currentRole))
        } else {
          foundRoleIds.push(currentRole.inherits)
          currentRole = findRole(currentRole.inherits, allRoles, opts)
          if (currentRole) {
            roleList.push(currentRole)
          }
        }
        // loop now found - stop iterating
        if (helpers.roles.checkForRoleInheritanceLoops(roleList)) {
          break
        }
      }
    }
    return uniqBy(roleList, role => role._id)
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
  return Object.values(BUILTIN_ROLE_IDS).includes(role)
}

export function prefixRoleIDNoBuiltin(roleId: string) {
  if (isBuiltin(roleId)) {
    return roleId
  } else {
    return prefixRoleID(roleId)
  }
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

export function validInherits(
  allRoles: RoleDoc[],
  inherits?: string | string[]
): boolean {
  if (!inherits) {
    return false
  }
  const find = (id: string) => allRoles.find(r => roleIDsAreEqual(r._id!, id))
  if (Array.isArray(inherits)) {
    const filtered = inherits.filter(roleId => find(roleId))
    return inherits.length !== 0 && filtered.length === inherits.length
  } else {
    return !!find(inherits)
  }
}

/**
 * Works through the inheritance ranks to see how far up the builtin stack this ID is.
 */
export function builtinRoleToNumber(id: string) {
  const builtins = getBuiltinRoles()
  const MAX = Object.values(builtins).length + 1
  if (
    roleIDsAreEqual(id, BUILTIN_IDS.ADMIN) ||
    roleIDsAreEqual(id, BUILTIN_IDS.BUILDER)
  ) {
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
          const foundRole = hierarchy.find(role =>
            roleIDsAreEqual(role._id!, roleId)
          )
          if (foundRole) {
            return findNumber(foundRole) + 1
          }
        })
        .filter(number => number)
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
  return Math.max(...hierarchy.map(findNumber))
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

export function roleIDsAreEqual(roleId1: string, roleId2: string) {
  // make sure both role IDs are prefixed correctly
  return prefixRoleID(roleId1) === prefixRoleID(roleId2)
}

export function externalRole(role: RoleDoc): RoleDoc {
  let _id: string | undefined
  if (role._id) {
    _id = getExternalRoleID(role._id)
  }
  return {
    ...role,
    _id,
    inherits: getExternalRoleIDs(role.inherits, role.version),
  }
}

/**
 * Given a list of roles, this will pick the role out, accounting for built ins.
 */
export function findRole(
  roleId: string,
  roles: RoleDoc[],
  opts?: { defaultPublic?: boolean }
): RoleDoc | undefined {
  // built in roles mostly come from the in-code implementation,
  // but can be extended by a doc stored about them (e.g. permissions)
  let role: RoleDoc | undefined = getBuiltinRole(roleId)
  if (!role) {
    // make sure has the prefix (if it has it then it won't be added)
    roleId = prefixRoleID(roleId)
  }
  const dbRole = roles.find(
    role => role._id && roleIDsAreEqual(role._id, roleId)
  )
  if (!dbRole && !isBuiltin(roleId) && opts?.defaultPublic) {
    return cloneDeep(BUILTIN_ROLES.PUBLIC)
  }
  // combine the roles
  role = Object.assign(role || {}, dbRole)
  // finalise the ID
  if (role?._id) {
    role._id = getExternalRoleID(role._id, role.version)
  }
  return Object.keys(role).length === 0 ? undefined : role
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
): Promise<RoleDoc | undefined> {
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

export async function saveRoles(roles: RoleDoc[]) {
  const db = getAppDB()
  await db.bulkDocs(
    roles
      .filter(role => role._id)
      .map(role => ({
        ...role,
        _id: prefixRoleID(role._id!),
      }))
  )
}

/**
 * Simple function to get all the roles based on the top level user role ID.
 */
async function getAllUserRoles(
  userRoleId: string,
  opts?: { defaultPublic?: boolean }
): Promise<RoleDoc[]> {
  const allRoles = await getAllRoles()
  // admins have access to all roles
  if (roleIDsAreEqual(userRoleId, BUILTIN_IDS.ADMIN)) {
    return allRoles
  }

  // get all the inherited roles
  const foundRole = findRole(userRoleId, allRoles, opts)
  let roles: RoleDoc[] = []
  if (foundRole) {
    const traversal = new RoleHierarchyTraversal(allRoles, opts)
    roles = traversal.walk(foundRole)
  }
  return roles
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
  async function internal(db: Database | undefined) {
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

    // exclude internal roles like builder
    let externalBuiltinRoles = []

    if (!db || (await shouldIncludePowerRole(db))) {
      externalBuiltinRoles = [
        BUILTIN_IDS.ADMIN,
        BUILTIN_IDS.POWER,
        BUILTIN_IDS.BASIC,
        BUILTIN_IDS.PUBLIC,
      ]
    } else {
      externalBuiltinRoles = [
        BUILTIN_IDS.ADMIN,
        BUILTIN_IDS.BASIC,
        BUILTIN_IDS.PUBLIC,
      ]
    }

    // need to combine builtin with any DB record of them (for sake of permissions)
    for (let builtinRoleId of externalBuiltinRoles) {
      const builtinRole = builtinRoles[builtinRoleId]
      const dbBuiltin = roles.filter(dbRole =>
        roleIDsAreEqual(dbRole._id!, builtinRoleId)
      )[0]
      if (dbBuiltin == null) {
        roles.push(builtinRole || builtinRoles.BASIC)
      } else {
        // remove role and all back after combining with the builtin
        roles = roles.filter(role => role._id !== dbBuiltin._id)
        dbBuiltin._id = getExternalRoleID(builtinRole._id!, dbBuiltin.version)
        roles.push({
          ...builtinRole,
          ...dbBuiltin,
          name: builtinRole.name,
          _id: getExternalRoleID(builtinRole._id!, builtinRole.version),
        })
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

async function shouldIncludePowerRole(db: Database) {
  const app = await db.tryGet<App>(DocumentType.APP_METADATA)
  const creationVersion = app?.creationVersion
  if (!creationVersion || !semver.valid(creationVersion)) {
    // Old apps don't have creationVersion, so we should include it for backward compatibility
    return true
  }

  const isGreaterThan3x = semver.gte(
    creationVersion,
    env.MIN_VERSION_WITHOUT_POWER_ROLE
  )
  return !isGreaterThan3x
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
      roleIDsAreEqual(tryingRoleId, BUILTIN_IDS.BUILDER) ||
      roleIDsAreEqual(userRoleId!, tryingRoleId) ||
      roleIDsAreEqual(userRoleId!, BUILTIN_IDS.BUILDER)
    ) {
      return true
    }
    let roleIds = userRoleId ? this.userHierarchies[userRoleId] : null
    if (!roleIds && userRoleId) {
      roleIds = await getUserRoleIdHierarchy(userRoleId)
      this.userHierarchies[userRoleId] = roleIds
    }

    return (
      roleIds?.find(roleId => roleIDsAreEqual(roleId, tryingRoleId)) !==
      undefined
    )
  }

  async checkScreensAccess(
    screens: Screen[],
    userRoleId: string
  ): Promise<Screen[]> {
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

export function getExternalRoleIDs(
  roleIds: string | string[] | undefined,
  version?: string
) {
  if (!roleIds) {
    return roleIds
  } else if (typeof roleIds === "string") {
    return getExternalRoleID(roleIds, version)
  } else {
    return roleIds.map(roleId => getExternalRoleID(roleId, version))
  }
}
