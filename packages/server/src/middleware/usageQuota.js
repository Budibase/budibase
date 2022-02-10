const usageQuota = require("../utilities/usageQuota")
const { getUniqueRows } = require("../utilities/usageQuota/rows")
const {
  isExternalTable,
  isRowId: isExternalRowId,
} = require("../integrations/utils")
const { getAppDB } = require("@budibase/backend-core/context")

// currently only counting new writes and deletes
const METHOD_MAP = {
  POST: 1,
  DELETE: -1,
}

const DOMAIN_MAP = {
  rows: usageQuota.Properties.ROW,
  // upload: usageQuota.Properties.UPLOAD,            // doesn't work yet
  // views: usageQuota.Properties.VIEW,               // doesn't work yet
  // users: usageQuota.Properties.USER,               // doesn't work yet
  applications: usageQuota.Properties.APPS,
  // this will not be updated by endpoint calls
  // instead it will be updated by triggerInfo
  // automationRuns: usageQuota.Properties.AUTOMATION, // doesn't work yet
}

function getProperty(url) {
  for (let domain of Object.keys(DOMAIN_MAP)) {
    if (url.indexOf(domain) !== -1) {
      return DOMAIN_MAP[domain]
    }
  }
}

module.exports = async (ctx, next) => {
  if (!usageQuota.useQuotas()) {
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
        const db = getAppDB()
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
    await performRequest(ctx, next, property, usage)
  } catch (err) {
    ctx.throw(400, err)
  }
}

const performRequest = async (ctx, next, property, usage) => {
  const usageContext = {
    skipNext: false,
    skipUsage: false,
    [usageQuota.Properties.APPS]: {},
  }

  if (usage === -1) {
    if (PRE_DELETE[property]) {
      await PRE_DELETE[property](ctx, usageContext)
    }
  } else {
    if (PRE_CREATE[property]) {
      await PRE_CREATE[property](ctx, usageContext)
    }
  }

  // run the request
  if (!usageContext.skipNext) {
    await usageQuota.update(property, usage, { dryRun: true })
    await next()
  }

  if (usage === -1) {
    if (POST_DELETE[property]) {
      await POST_DELETE[property](ctx, usageContext)
    }
  } else {
    if (POST_CREATE[property]) {
      await POST_CREATE[property](ctx, usageContext)
    }
  }

  // update the usage
  if (!usageContext.skipUsage) {
    await usageQuota.update(property, usage)
  }
}

const appPreDelete = async (ctx, usageContext) => {
  if (ctx.query.unpublish) {
    // don't run usage decrement for unpublish
    usageContext.skipUsage = true
    return
  }

  // store the row count to delete
  const rows = await getUniqueRows([ctx.appId])
  if (rows.length) {
    usageContext[usageQuota.Properties.APPS] = { rowCount: rows.length }
  }
}

const appPostDelete = async (ctx, usageContext) => {
  // delete the app rows from usage
  const rowCount = usageContext[usageQuota.Properties.APPS].rowCount
  if (rowCount) {
    await usageQuota.update(usageQuota.Properties.ROW, -rowCount)
  }
}

const appPostCreate = async ctx => {
  // app import & template creation
  if (ctx.request.body.useTemplate === "true") {
    const rows = await getUniqueRows([ctx.response.body.appId])
    const rowCount = rows ? rows.length : 0
    await usageQuota.update(usageQuota.Properties.ROW, rowCount)
  }
}

const PRE_DELETE = {
  [usageQuota.Properties.APPS]: appPreDelete,
}

const POST_DELETE = {
  [usageQuota.Properties.APPS]: appPostDelete,
}

const PRE_CREATE = {}

const POST_CREATE = {
  [usageQuota.Properties.APPS]: appPostCreate,
}
