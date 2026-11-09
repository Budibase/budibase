import { context, HTTPError, roles } from "@budibase/backend-core"
import { isViewId } from "@budibase/shared-core"
import {
  type AnyDocument,
  type Datasource,
  PermissionLevel,
  ResourceType,
  type Role,
  type Table,
} from "@budibase/types"
import { isV2 } from "../../views"

interface PermissionResource {
  resourceType: ResourceType
  doc: AnyDocument
}

interface ResourcePermission {
  resourceId: string
  levels: Partial<Record<PermissionLevel, string>>
}

export interface ProjectPackagePermissions {
  resources: ResourcePermission[]
}

export interface ImportedPermissionChanges {
  resourceIds: string[]
  roles: { id: string; createdRevision?: string }[]
}

const permissionLevels = [
  PermissionLevel.READ,
  PermissionLevel.WRITE,
  PermissionLevel.EXECUTE,
]

const getPermissionResourceIds = (resources: PermissionResource[]) => {
  const ids = new Set<string>()
  const addTable = (table: Table) => {
    if (table._id) {
      ids.add(table._id)
    }
    for (const view of Object.values(table.views || {})) {
      if (isV2(view) && isViewId(view.id)) {
        ids.add(view.id)
      }
    }
  }
  for (const { resourceType, doc } of resources) {
    if (resourceType === ResourceType.TABLE) {
      addTable(doc as Table)
    } else if (resourceType === ResourceType.DATASOURCE) {
      ids.add(doc._id!)
      for (const table of Object.values((doc as Datasource).entities || {})) {
        addTable(table)
      }
    } else if (
      resourceType === ResourceType.QUERY ||
      resourceType === ResourceType.AUTOMATION
    ) {
      ids.add(doc._id!)
    }
  }
  return ids
}

export const exportProjectPermissions = async ({
  resources,
}: {
  resources: PermissionResource[]
}): Promise<ProjectPackagePermissions> => {
  const resourceIds = getPermissionResourceIds(resources)
  const permissions = new Map<string, ResourcePermission>()
  for (const role of await roles.getAllRoles()) {
    for (const resourceId of resourceIds) {
      for (const level of role.permissions?.[resourceId] || []) {
        if (!permissionLevels.includes(level)) {
          continue
        }
        const permission: ResourcePermission = permissions.get(resourceId) || {
          resourceId,
          levels: {},
        }
        permission.levels[level] = role._id!
        permissions.set(resourceId, permission)
      }
    }
  }
  return { resources: [...permissions.values()] }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export const validateProjectPermissions = ({
  value,
  resources,
}: {
  value: unknown
  resources: PermissionResource[]
}): ProjectPackagePermissions => {
  const invalid = () =>
    new HTTPError("Project package permissions are invalid.", 400)
  if (!isRecord(value) || !Array.isArray(value.resources)) {
    throw invalid()
  }
  const resourceIds = getPermissionResourceIds(resources)
  const seen = new Set<string>()
  const permissions: ResourcePermission[] = []
  for (const permission of value.resources) {
    if (
      !isRecord(permission) ||
      typeof permission.resourceId !== "string" ||
      !resourceIds.has(permission.resourceId) ||
      seen.has(permission.resourceId) ||
      !isRecord(permission.levels)
    ) {
      throw invalid()
    }
    const levels: ResourcePermission["levels"] = {}
    for (const [level, roleId] of Object.entries(permission.levels)) {
      const permissionLevel = permissionLevels.find(value => value === level)
      if (!permissionLevel || typeof roleId !== "string" || !roleId.trim()) {
        throw invalid()
      }
      levels[permissionLevel] = roleId
    }
    seen.add(permission.resourceId)
    permissions.push({ resourceId: permission.resourceId, levels })
  }
  return { resources: permissions }
}

export const importProjectPermissions = async ({
  permissions,
  idMap,
  sourceWorkspaceId,
  changes,
}: {
  permissions: ProjectPackagePermissions
  idMap: Map<string, string>
  sourceWorkspaceId: string
  changes: ImportedPermissionChanges
}) => {
  const db = context.getWorkspaceDB()
  const destinationRoles = await roles.getAllRoles()
  const builtinRoles = roles.getBuiltinRoles()
  const updates = new Map<string, Record<string, PermissionLevel[]>>()
  const restrictedResourceIds = new Set<string>()
  for (const { resourceId, levels } of permissions.resources) {
    const destinationId = idMap.get(resourceId)
    if (!destinationId) {
      throw new HTTPError("Project permission could not be remapped.", 400)
    }
    changes.resourceIds.push(destinationId)
    for (const level of permissionLevels) {
      const sourceRoleId = levels[level]
      if (!sourceRoleId) {
        continue
      }
      const matchedRole = destinationRoles.find(role =>
        roles.roleIDsAreEqual(role._id!, sourceRoleId)
      )
      const canMapRole =
        !!matchedRole &&
        (roles.isBuiltin(sourceRoleId) ||
          sourceWorkspaceId === context.getWorkspaceId())
      const destinationRoleId = canMapRole
        ? roles.getDBRoleID(matchedRole?._id || sourceRoleId)
        : roles.getDBRoleID(roles.BUILTIN_ROLE_IDS.ADMIN)
      if (!canMapRole) {
        restrictedResourceIds.add(destinationId)
      }
      const rolePermissions = updates.get(destinationRoleId) || {}
      rolePermissions[destinationId] ||= []
      rolePermissions[destinationId].push(level)
      updates.set(destinationRoleId, rolePermissions)
    }
  }
  for (const [roleId, permissions] of updates) {
    const existing = await db.tryGet<Role>(roleId)
    const builtin = Object.values(builtinRoles).find(
      role => roles.getDBRoleID(role._id!) === roleId
    )
    const role = existing || builtin
    if (!role) {
      throw new Error("Project permission role no longer exists")
    }
    const updated: Role = {
      ...structuredClone(role),
      _id: roleId,
      permissions: { ...existing?.permissions, ...permissions },
    }
    const result = await db.put(updated)
    changes.roles.push({
      id: roleId,
      ...(!existing && { createdRevision: result.rev }),
    })
  }
  return [...restrictedResourceIds]
}

export const rollbackProjectPermissions = async ({
  changes,
}: {
  changes: ImportedPermissionChanges
}) => {
  const db = context.getWorkspaceDB()
  const results = await Promise.allSettled(
    changes.roles.map(async ({ id, createdRevision }) => {
      const role = await db.tryGet<Role>(id)
      if (!role) {
        return
      }
      if (createdRevision && role._rev === createdRevision) {
        await db.remove(id, role._rev)
        return
      }
      const permissions = { ...role.permissions }
      for (const resourceId of changes.resourceIds) {
        delete permissions[resourceId]
      }
      await db.put({ ...role, permissions })
    })
  )
  const failure = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected"
  )
  if (failure) {
    throw failure.reason
  }
}
