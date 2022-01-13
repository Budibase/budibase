const {
  getAllApps,
  getDeployedAppID,
  isProdAppID,
} = require("@budibase/backend-core/db")
const CouchDB = require("../../db")

const URL_REGEX_SLASH = /\/|\\/g

exports.getApps = async ctx => {
  const apps = await getAllApps(CouchDB, { all: true })
  const body = {}
  for (let app of apps) {
    let url = app.url || encodeURI(`${app.name}`)
    url = `/${url.replace(URL_REGEX_SLASH, "")}`
    const appId = app.appId,
      isProd = isProdAppID(app.appId)
    if (!body[url]) {
      body[url] = {
        appId: getDeployedAppID(appId),
        name: app.name,
        url,
        deployed: isProd,
      }
    } else {
      body[url].deployed = isProd || body[url].deployed
    }
  }
  ctx.body = body
}
