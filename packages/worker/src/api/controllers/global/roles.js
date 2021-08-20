const { getAllRoles } = require("@budibase/auth/roles")
const {
  getAllApps,
  getDeployedAppID,
  DocumentTypes,
} = require("@budibase/auth/db")
const CouchDB = require("../../../db")

exports.fetch = async ctx => {
  const tenantId = ctx.user.tenantId
  // always use the dev apps as they'll be most up to date (true)
  const apps = await getAllApps(CouchDB, { tenantId, all: true })
  const promises = []
  for (let app of apps) {
    // use dev app IDs
    promises.push(getAllRoles(app.appId))
  }
  const roles = await Promise.all(promises)
  const response = {}
  for (let app of apps) {
    const deployedAppId = getDeployedAppID(app.appId)
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
  const db = new CouchDB(appId)
  const app = await db.get(DocumentTypes.APP_METADATA)
  ctx.body = {
    roles: await getAllRoles(appId),
    name: app.name,
    version: app.version,
    url: app.url,
  }
}
