const { getAllRoles } = require("@budibase/auth/roles")
const { getAllApps } = require("@budibase/auth/db")

exports.fetch = async ctx => {
  // always use the dev apps as they'll be most up to date (true)
  const apps = await getAllApps(true)
  const promises = []
  for (let app of apps) {
    promises.push(getAllRoles(app._id))
  }
  const roles = await Promise.all(promises)
  const response = {}
  for (let app of apps) {
    response[app._id] = roles.shift()
  }
  ctx.body = response
}

exports.find = async ctx => {
  const appId = ctx.params.appId
  ctx.body = {
    roles: await getAllRoles(appId)
  }
}
