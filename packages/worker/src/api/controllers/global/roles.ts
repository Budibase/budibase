import {
  cache,
  context,
  db as dbCore,
  roles,
  tenancy,
} from "@budibase/backend-core"
import {
  Ctx,
  FetchGlobalRolesResponse,
  FindGlobalRoleResponse,
  RemoveWorkspaceRoleResponse,
  Workspace,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function fetch(ctx: Ctx<void, FetchGlobalRolesResponse>) {
  const tenantId = ctx.user!.tenantId
  await context.doInTenant(tenantId, async () => {
    // always use the dev workspaces as they'll be most up to date (true)
    const workspaces = await dbCore.getAllWorkspaces({ all: true })
    const promises = []
    for (let workspace of workspaces) {
      // use dev workspace IDs
      promises.push(roles.getAllRoles(workspace.appId))
    }
    const roleList = await Promise.all(promises)
    const response: any = {}
    for (let workspace of workspaces) {
      const deployedAppId = dbCore.getProdWorkspaceID(workspace.appId)
      response[deployedAppId] = {
        roles: roleList.shift(),
        name: workspace.name,
        version: workspace.version,
        url: workspace.url,
      }
    }
    ctx.body = response
  })
}

export async function find(ctx: Ctx<void, FindGlobalRoleResponse>) {
  const appId = ctx.params.appId
  await context.doInWorkspaceContext(
    dbCore.getDevWorkspaceID(appId),
    async () => {
      const db = context.getWorkspaceDB()
      const app = await db.get<Workspace>(
        dbCore.DocumentType.WORKSPACE_METADATA
      )
      ctx.body = {
        roles: await roles.getAllRoles(),
        name: app.name,
        version: app.version,
        url: app.url,
      }
    }
  )
}

export async function removeAppRole(
  ctx: Ctx<void, RemoveWorkspaceRoleResponse>
) {
  const { appId } = ctx.params
  const db = tenancy.getGlobalDB()
  const users = await sdk.users.db.allUsers()
  const bulk = []
  const cacheInvalidations = []
  const prodAppId = dbCore.getProdWorkspaceID(appId)
  for (let user of users) {
    let updated = false
    if (user.roles[prodAppId]) {
      cacheInvalidations.push(cache.user.invalidateUser(user._id!))
      delete user.roles[prodAppId]
      updated = true
    }
    if (user.builder && Array.isArray(user.builder?.apps)) {
      const idx = user.builder.apps.indexOf(prodAppId)
      if (idx !== -1) {
        user.builder.apps.splice(idx, 1)
        updated = true
      }
    }
    if (updated) {
      bulk.push(user)
    }
  }
  await db.bulkDocs(bulk)
  await Promise.all(cacheInvalidations)
  ctx.body = {
    message: "App role removed from all users",
  }
}
