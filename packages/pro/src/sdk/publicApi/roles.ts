import { db as dbCore } from "@budibase/backend-core"
import { isExpandedPublicApiEnabled } from "../features"
import { db as userDB } from "../users"

interface AssignmentOpts {
  role?: {
    appId: string
    roleId: string
  }
  appBuilder?: {
    appId: string
  }
  builder?: boolean
  admin?: boolean
}

export async function assign(userIds: string[], opts: AssignmentOpts) {
  if (!(await isExpandedPublicApiEnabled())) {
    throw new Error("Unable to assign roles - license required.")
  }
  const users = await userDB.bulkGet(userIds)
  for (let user of users) {
    if (opts.role && opts.role.roleId) {
      const prodWorkspaceId = dbCore.getProdWorkspaceID(opts.role.appId)
      user.roles[prodWorkspaceId] = opts.role.roleId
    }
    if (opts.appBuilder) {
      const prodWorkspaceId = dbCore.getProdWorkspaceID(opts.appBuilder.appId)
      const existing = user.builder?.apps || []
      user.builder = {
        apps: existing.concat([prodWorkspaceId]),
      }
    }
    if (opts.builder) {
      user.builder = {
        global: true,
      }
    }
    if (opts.admin) {
      user.admin = {
        global: true,
      }
    }
    user.roles
  }
  await userDB.bulkUpdate(users)
}

export async function unAssign(userIds: string[], opts: AssignmentOpts) {
  if (!(await isExpandedPublicApiEnabled())) {
    throw new Error("Unable to un-assign roles - license required.")
  }
  const users = await userDB.bulkGet(userIds)
  for (let user of users) {
    if (opts.role) {
      const prodWorkspaceId = dbCore.getProdWorkspaceID(opts.role?.appId)
      if (user.roles[prodWorkspaceId] === opts.role.roleId) {
        delete user.roles[prodWorkspaceId]
      }
    }
    if (opts.appBuilder && user.builder?.apps) {
      const prodWorkspaceId = dbCore.getProdWorkspaceID(opts.appBuilder.appId)
      user.builder.apps = user.builder.apps.filter(
        appId => appId !== prodWorkspaceId
      )
    }
    if (opts.builder && user.builder) {
      delete user.builder
    }
    if (opts.admin && user.admin) {
      delete user.admin
    }
  }
  await userDB.bulkUpdate(users)
}
