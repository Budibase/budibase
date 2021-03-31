const CouchDB = require("../../db")
const {
  getHostingInfo,
  getDeployedApps,
  HostingTypes,
  getAppUrl,
} = require("../../utilities/builder/hosting")
const { StaticDatabases } = require("../../db/utils")

exports.fetchInfo = async ctx => {
  ctx.body = {
    types: Object.values(HostingTypes),
  }
}

exports.save = async ctx => {
  const db = new CouchDB(StaticDatabases.BUILDER_HOSTING.name)
  const { type } = ctx.request.body
  if (type === HostingTypes.CLOUD && ctx.request.body._rev) {
    ctx.body = await db.remove({
      ...ctx.request.body,
      _id: StaticDatabases.BUILDER_HOSTING.baseDoc,
    })
  } else {
    ctx.body = await db.put({
      ...ctx.request.body,
      _id: StaticDatabases.BUILDER_HOSTING.baseDoc,
    })
  }
}

exports.fetch = async ctx => {
  ctx.body = await getHostingInfo()
}

exports.fetchUrls = async ctx => {
  ctx.body = {
    app: await getAppUrl(ctx.appId),
  }
}

exports.getDeployedApps = async ctx => {
  ctx.body = await getDeployedApps()
}
