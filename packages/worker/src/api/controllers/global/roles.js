const { getAllRoles } = require("@budibase/backend-core/roles")
const {
  getAllApps,
  getProdAppID,
  DocumentType,
} = require("@budibase/backend-core/db")
const { doInAppContext, getAppDB } = require("@budibase/backend-core/context")
const { user: userCache } = require("@budibase/backend-core/cache")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { allUsers } = require("../../../sdk/users")

exports.fetch = async ctx => {
  const tenantId = ctx.user.tenantId
  // always use the dev apps as they'll be most up to date (true)
  const apps = await getAllApps({ tenantId, all: true })
  const promises = []
  for (let app of apps) {
    // use dev app IDs
    promises.push(getAllRoles(app.appId))
  }
  const roles = await Promise.all(promises)
  const response = {}
  for (let app of apps) {
    const deployedAppId = getProdAppID(app.appId)
    response[deployedAppId] = {
      roles: roles.shift(),
      name: app.name,
      version: app.version,
      url: app.url,
    }
  }
  ctx.body = response
}

exports.find = async ctx => {
  const appId = ctx.params.appId
  await doInAppContext(appId, async () => {
    const db = getAppDB()
    const app = await db.get(DocumentType.APP_METADATA)
    ctx.body = {
      roles: await getAllRoles(),
      name: app.name,
      version: app.version,
      url: app.url,
    }
  })
}

exports.removeAppRole = async ctx => {
  const { appId } = ctx.params
  const db = getGlobalDB()
  const users = await allUsers(ctx)
  const bulk = []
  const cacheInvalidations = []
  for (let user of users) {
    if (user.roles[appId]) {
      cacheInvalidations.push(userCache.invalidateUser(user._id))
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
