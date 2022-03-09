import * as Pro from "@budibase/pro"
const { getUniqueRows } = require("../utilities/usageQuota/rows")
const {
  isExternalTable,
  isRowId: isExternalRowId,
} = require("../integrations/utils")
const { getAppDB } = require("@budibase/backend-core/context")

// currently only counting new writes and deletes
const METHOD_MAP: any = {
  POST: 1,
  DELETE: -1,
}

const DOMAIN_MAP: any = {
  rows: {
    name: Pro.StaticQuotaName.ROWS,
    type: Pro.QuotaUsageType.STATIC,
  },
  applications: {
    name: Pro.StaticQuotaName.APPS,
    type: Pro.QuotaUsageType.STATIC,
  },
}

function getQuotaInfo(url: string) {
  for (let domain of Object.keys(DOMAIN_MAP)) {
    if (url.indexOf(domain) !== -1) {
      return DOMAIN_MAP[domain]
    }
  }
}

module.exports = async (ctx: any, next: any) => {
  if (!Pro.Licensing.Quotas.useQuotas()) {
    return next()
  }

  let usage = METHOD_MAP[ctx.req.method]
  const quotaInfo = getQuotaInfo(ctx.req.url)
  if (usage == null || quotaInfo == null) {
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
  try {
    await performRequest(ctx, next, quotaInfo, usage)
  } catch (err) {
    ctx.throw(400, err)
  }
}

const performRequest = async (
  ctx: any,
  next: any,
  quotaInfo: any,
  usage: number
) => {
  const usageContext = {
    skipNext: false,
    skipUsage: false,
    [Pro.StaticQuotaName.APPS]: {},
  }

  const quotaName = quotaInfo.name

  if (usage === -1) {
    if (PRE_DELETE[quotaName]) {
      await PRE_DELETE[quotaName](ctx, usageContext)
    }
  } else {
    if (PRE_CREATE[quotaName]) {
      await PRE_CREATE[quotaName](ctx, usageContext)
    }
  }

  // run the request
  if (!usageContext.skipNext) {
    await Pro.Licensing.Quotas.updateUsage(usage, quotaName, quotaInfo.type, {
      dryRun: true,
    })
    await next()
  }

  if (usage === -1) {
    if (POST_DELETE[quotaName]) {
      await POST_DELETE[quotaName](ctx, usageContext)
    }
  } else {
    if (POST_CREATE[quotaName]) {
      await POST_CREATE[quotaName](ctx)
    }
  }

  // update the usage
  if (!usageContext.skipUsage) {
    await Pro.Licensing.Quotas.updateUsage(usage, quotaName, quotaInfo.type)
  }
}

const appPreDelete = async (ctx: any, usageContext: any) => {
  if (ctx.query.unpublish) {
    // don't run usage decrement for unpublish
    usageContext.skipUsage = true
    return
  }

  // store the row count to delete
  const rows = await getUniqueRows([ctx.appId])
  if (rows.length) {
    usageContext[Pro.StaticQuotaName.APPS] = { rowCount: rows.length }
  }
}

const appPostDelete = async (ctx: any, usageContext: any) => {
  // delete the app rows from usage
  const rowCount = usageContext[Pro.StaticQuotaName.ROWS].rowCount
  if (rowCount) {
    await Pro.Licensing.Quotas.updateUsage(
      -rowCount,
      Pro.StaticQuotaName.ROWS,
      Pro.QuotaUsageType.STATIC
    )
  }
}

const appPostCreate = async (ctx: any) => {
  // app import & template creation
  if (ctx.request.body.useTemplate === "true") {
    const rows = await getUniqueRows([ctx.response.body.appId])
    const rowCount = rows ? rows.length : 0
    await Pro.Licensing.Quotas.updateUsage(
      rowCount,
      Pro.StaticQuotaName.ROWS,
      Pro.QuotaUsageType.STATIC
    )
  }
}

const PRE_DELETE: any = {
  [Pro.StaticQuotaName.APPS]: appPreDelete,
}

const POST_DELETE: any = {
  [Pro.StaticQuotaName.APPS]: appPostDelete,
}

const PRE_CREATE: any = {}

const POST_CREATE: any = {
  [Pro.StaticQuotaName.APPS]: appPostCreate,
}
