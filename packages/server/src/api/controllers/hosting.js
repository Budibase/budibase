const CouchDB = require("../../db")
const { getDeployedApps } = require("../../utilities/workerRequests")
const { getScopedConfig } = require("@budibase/auth").db
const { Configs } = require("@budibase/auth").constants
const { checkSlashesInUrl } = require("../../utilities")

exports.fetchUrls = async ctx => {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const settings = await getScopedConfig(db, { type: Configs.SETTINGS })
  let appUrl = "http://localhost:10000/app"
  if (settings && settings["platformUrl"]) {
    appUrl = checkSlashesInUrl(`${settings["platformUrl"]}/app`)
  }
  ctx.body = {
    app: appUrl,
  }
}

exports.getDeployedApps = async ctx => {
  ctx.body = await getDeployedApps(ctx)
}
