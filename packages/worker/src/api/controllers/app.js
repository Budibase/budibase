const fetch = require("node-fetch")
const CouchDB = require("../../db")
const env = require("../../environment")

const APP_PREFIX = "app_"

exports.getApps = async ctx => {
  let allDbs
  // allDbs call of CouchDB is very inaccurate in production
  if (env.COUCH_DB_URL) {
    allDbs = await (await fetch(`${env.COUCH_DB_URL}/_all_dbs`)).json()
  } else {
    allDbs = await CouchDB.allDbs()
  }
  const appDbNames = allDbs.filter(dbName => dbName.startsWith(APP_PREFIX))
  const appPromises = appDbNames.map(db => new CouchDB(db).get(db))
  const apps = await Promise.all(appPromises)
  const body = {}
  for (let app of apps) {
    let url = app.url || encodeURI(`${app.name}`)
    url = `/${url.replace(/\/|\\/g, "")}`
    body[url] = {
      appId: app._id,
      name: app.name,
      url,
    }
  }
  ctx.body = body
}
