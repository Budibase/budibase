const env = require("../../environment")
const { getGlobalDB, getTenantId } = require("@budibase/backend-core/tenancy")
const {
  StaticDatabases,
  generateNewUsageQuotaDoc,
} = require("@budibase/backend-core/db")

exports.useQuotas = () => {
  // check if quotas are enabled
  if (env.USE_QUOTAS) {
    // check if there are any tenants without limits
    if (env.EXCLUDE_QUOTAS_TENANTS) {
      const excludedTenants = env.EXCLUDE_QUOTAS_TENANTS.replace(
        /\s/g,
        ""
      ).split(",")
      const tenantId = getTenantId()
      if (excludedTenants.includes(tenantId)) {
        return false
      }
    }
    return true
  }
  return false
}

exports.Properties = {
  ROW: "rows",
  UPLOAD: "storage", // doesn't work yet
  VIEW: "views", // doesn't work yet
  USER: "users", // doesn't work yet
  AUTOMATION: "automationRuns", // doesn't work yet
  APPS: "apps",
  EMAILS: "emails", // doesn't work yet
}

exports.getUsageQuotaDoc = async db => {
  let quota
  try {
    quota = await db.get(StaticDatabases.GLOBAL.docs.usageQuota)
  } catch (err) {
    // doc doesn't exist. Create it
    quota = generateNewUsageQuotaDoc()
    const response = await db.put(quota)
    quota._rev = response.rev
  }

  return quota
}

/**
 * Given a specified tenantId this will add to the usage object for the specified property.
 * @param {string} property The property which is to be added to (within the nested usageQuota object).
 * @param {number} usage The amount (this can be negative) to adjust the number by.
 * @param {object} opts optional - options such as dryRun, to check what update will do.
 * @returns {Promise<void>} When this completes the API key will now be up to date - the quota period may have
 * also been reset after this call.
 */
exports.update = async (property, usage, opts = { dryRun: false }) => {
  if (!exports.useQuotas()) {
    return
  }

  try {
    const db = getGlobalDB()
    const quota = await exports.getUsageQuotaDoc(db)

    // increment the quota
    quota.usageQuota[property] += usage

    if (
      quota.usageQuota[property] > quota.usageLimits[property] &&
      usage > 0 // allow for decrementing usage when the quota is already exceeded
    ) {
      throw new Error(
        `You have exceeded your usage quota of ${quota.usageLimits[property]} ${property}.`
      )
    }

    if (quota.usageQuota[property] < 0) {
      // never go negative if the quota has previously been exceeded
      quota.usageQuota[property] = 0
    }

    // update the usage quotas
    if (!opts.dryRun) {
      await db.put(quota)
    }
  } catch (err) {
    console.error(`Error updating usage quotas for ${property}`, err)
    throw err
  }
}
