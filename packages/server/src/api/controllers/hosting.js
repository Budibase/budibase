const CouchDB = require("../../db")
const { BUILDER_CONFIG_DB, HOSTING_DOC } = require("../../constants")
const {
  getHostingInfo,
  HostingTypes,
  getAppServerUrl,
} = require("../../utilities/builder/hosting")

exports.fetchInfo = async ctx => {
  ctx.body = {
    types: Object.values(HostingTypes),
  }
}

exports.save = async ctx => {
  const db = new CouchDB(BUILDER_CONFIG_DB)
  const { type, appServerUrl, objectStoreUrl, useHttps } = ctx.request.body
  if (type === HostingTypes.CLOUD) {
    ctx.throw(400, "Cannot update Cloud hosting information")
  }
  const response = await db.put({
    _id: HOSTING_DOC,
    type,
    appServerUrl,
    objectStoreUrl,
    useHttps,
  })
  ctx.body = response
}

exports.fetch = async ctx => {
  ctx.body = await getHostingInfo()
}

exports.fetchUrls = async ctx => {
  ctx.body = {
    appServer: getAppServerUrl(ctx.appId),
  }
}
