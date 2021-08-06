const { DocumentTypes, getAllDbs } = require("@budibase/auth").db
const CouchDB = require("../../db")

const APP_PREFIX = "app_"
const URL_REGEX_SLASH = /\/|\\/g

exports.getApps = async ctx => {
  const dbs = await getAllDbs()
  const appDbNames = dbs.filter(dbName => dbName.startsWith(APP_PREFIX))
  const appPromises = appDbNames.map(db =>
    new CouchDB(db, { skip_setup: true }).get(DocumentTypes.APP_METADATA)
  )

  const apps = await Promise.allSettled(appPromises)
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
