const CouchDB = require("../db")
const usageQuota = require("../utilities/usageQuota")
const env = require("../environment")
const { getTenantId } = require("@budibase/auth/tenancy")
const {
  isExternalTable,
  isRowId: isExternalRowId,
} = require("../integrations/utils")

// tenants without limits
const EXCLUDED_TENANTS = ["bb", "default", "bbtest", "bbstaging"]

// currently only counting new writes and deletes
const METHOD_MAP = {
  POST: 1,
  DELETE: -1,
}

const DOMAIN_MAP = {
  rows: usageQuota.Properties.ROW,
  upload: usageQuota.Properties.UPLOAD,
  views: usageQuota.Properties.VIEW,
  users: usageQuota.Properties.USER,
  applications: usageQuota.Properties.APPS,
  // this will not be updated by endpoint calls
  // instead it will be updated by triggerInfo
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
  const tenantId = getTenantId()

  // if in development or a self hosted cloud usage quotas should not be executed
  if (env.isDev() || env.SELF_HOSTED || EXCLUDED_TENANTS.includes(tenantId)) {
    return next()
  }

  let usage = METHOD_MAP[ctx.req.method]
  const property = getProperty(ctx.req.url)
  if (usage == null || property == null) {
    return next()
  }
  // post request could be a save of a pre-existing entry
  if (ctx.request.body && ctx.request.body._id && ctx.request.body._rev) {
    const usageId = ctx.request.body._id
    try {
      if (ctx.appId) {
        const db = new CouchDB(ctx.appId)
        await db.get(usageId)
      }
      return next()
    } catch (err) {
      if (
        isExternalTable(usageId) ||
        (ctx.request.body.tableId &&
          isExternalTable(ctx.request.body.tableId)) ||
        isExternalRowId(usageId)
      ) {
        return next()
      } else {
        ctx.throw(404, `${usageId} does not exist`)
      }
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
  try {
    await usageQuota.update(property, usage)
    return next()
  } catch (err) {
    ctx.throw(400, err)
  }
}
