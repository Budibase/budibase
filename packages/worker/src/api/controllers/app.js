const { getAllApps } = require("@budibase/auth/db")
const CouchDB = require("../../db")

const URL_REGEX_SLASH = /\/|\\/g

exports.getApps = async ctx => {
  const tenantId = ctx.user.tenantId
  const apps = await getAllApps(CouchDB, { tenantId })

  const body = {}
  for (let app of apps) {
    if (app.status !== "fulfilled") {
      continue
    }
    app = app.value
    let url = app.url || encodeURI(`${app.name}`)
    url = `/${url.replace(URL_REGEX_SLASH, "")}`
    body[url] = {
      appId: app.appId,
      name: app.name,
      url,
    }
  }
  ctx.body = body
}
