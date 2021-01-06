const CouchDB = require("../../db")
const { BUILDER_CONFIG_DB, HOSTING_DOC } = require("../../constants")
const {
  getHostingInfo,
  HostingTypes,
  getAppUrl,
} = require("../../utilities/builder/hosting")

exports.fetchInfo = async ctx => {
  ctx.body = {
    types: Object.values(HostingTypes),
  }
}

exports.save = async ctx => {
  const db = new CouchDB(BUILDER_CONFIG_DB)
  const { type } = ctx.request.body
  if (type === HostingTypes.CLOUD && ctx.request.body._rev) {
    ctx.body = await db.remove({
      ...ctx.request.body,
      _id: HOSTING_DOC,
    })
  } else {
    ctx.body = await db.put({
      ...ctx.request.body,
      _id: HOSTING_DOC,
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
