const CouchDB = require("../db")
const usageQuota = require("../utilities/usageQuota")
const environment = require("../environment")

// currently only counting new writes and deletes
const METHOD_MAP = {
  POST: 1,
  DELETE: -1,
}

const DOMAIN_MAP = {
  records: usageQuota.Properties.RECORD,
  upload: usageQuota.Properties.UPLOAD,
  views: usageQuota.Properties.VIEW,
  users: usageQuota.Properties.USER,
  // this will not be updated by endpoint calls
  // instead it will be updated by triggers
  automationRuns: usageQuota.Properties.AUTOMATION,
}

function getProperty(url) {
  for (let domain of Object.keys(DOMAIN_MAP)) {
    if (url.indexOf(domain) !== -1) {
      return DOMAIN_MAP[domain]
    }
  }
}

module.exports = async (ctx, next) => {
  const db = new CouchDB(ctx.user.instanceId)
  let usage = METHOD_MAP[ctx.req.method]
  const property = getProperty(ctx.req.url)
  if (usage == null || property == null) {
    return next()
  }
  // post request could be a save of a pre-existing entry
  if (ctx.request.body && ctx.request.body._id) {
    try {
      ctx.preExisting = await db.get(ctx.request.body._id)
      return next()
    } catch (err) {
      ctx.throw(404, `${ctx.request.body._id} does not exist`)
      return
    }
  }
  // update usage for uploads to be the total size
  if (property === usageQuota.Properties.UPLOAD) {
    const files =
      ctx.request.files.file.length > 1
        ? Array.from(ctx.request.files.file)
        : [ctx.request.files.file]
    usage = files.map(file => file.size).reduce((total, size) => total + size)
  }
  if (!environment.CLOUD) {
    return next()
  }
  try {
    await usageQuota.update(ctx.apiKey, property, usage)
    return next()
  } catch (err) {
    ctx.throw(403, err)
  }
}
