import {
  db as dbCore,
  roles,
  context,
  cache,
  tenancy,
} from "@budibase/backend-core"
import { BBContext, App } from "@budibase/types"
import { allUsers } from "../../../sdk/users"

export async function fetch(ctx: BBContext) {
  const tenantId = ctx.user!.tenantId
  // always use the dev apps as they'll be most up to date (true)
  const apps = (await dbCore.getAllApps({ tenantId, all: true })) as App[]
  const promises = []
  for (let app of apps) {
    // use dev app IDs
    promises.push(roles.getAllRoles(app.appId))
  }
  const roleList = await Promise.all(promises)
  const response: any = {}
  for (let app of apps) {
    const deployedAppId = dbCore.getProdAppID(app.appId)
    response[deployedAppId] = {
      roles: roleList.shift(),
      name: app.name,
      version: app.version,
      url: app.url,
    }
  }
  ctx.body = response
}

export async function find(ctx: BBContext) {
  const appId = ctx.params.appId
  await context.doInAppContext(dbCore.getDevAppID(appId), async () => {
    const db = context.getAppDB()
    const app = await db.get(dbCore.DocumentType.APP_METADATA)
    ctx.body = {
      roles: await roles.getAllRoles(),
      name: app.name,
      version: app.version,
      url: app.url,
    }
  })
}

export async function removeAppRole(ctx: BBContext) {
  const { appId } = ctx.params
  const db = tenancy.getGlobalDB()
  const users = await allUsers()
  const bulk = []
  const cacheInvalidations = []
  for (let user of users) {
    if (user.roles[appId]) {
      cacheInvalidations.push(cache.user.invalidateUser(user._id))
      delete user.roles[appId]
      bulk.push(user)
    }
  }
  await db.bulkDocs(bulk)
  await Promise.all(cacheInvalidations)
  ctx.body = {
    message: "App role removed from all users",
  }
}
