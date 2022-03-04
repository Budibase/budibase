const { getTenantId } = require("../../context")
const cache = require("../cache")
const env = require("../../environment")
const utils = require("../../utils")
const { UsageLimitError } = require("../../errors")

const UsageType = {
  MONTHLY: "monthly",
  STATIC: "static",
}

const StaticUsageLimits = {
  MAX_DEVELOPERS: "maxDevelopers",
  QUERY_TIMEOUT_SECONDS: "queryTimeoutSeconds",
}

// eslint-disable-next-line no-unused-vars
const MonthlyUsageLimits = {
  MAX_QUERY_COUNT: "maxQueryCount",
}

exports.checkMaxDevelopers = async () => {
  const developerCount = await utils.getBuildersCount()
  await checkUsageLimit(
    developerCount,
    UsageType.STATIC,
    StaticUsageLimits.MAX_DEVELOPERS
  )
}

const checkUsageLimit = async (currentUsage, usageType, usageLimit) => {
  const tenantId = getTenantId()
  const license = await cache.getLicense(tenantId)
  const limit = license.usageLimits[usageType][usageLimit]
  if (currentUsage >= limit.value) {
    throw new UsageLimitError(
      `Licensed ${limit.name} has been exceeded. To upgrade, visit ${env.ACCOUNT_PORTAL_URL}/portal/plans`,
      limit.name
    )
  }
}
