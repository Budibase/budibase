const env = require("../environment")
const { getGlobalDB } = require("@budibase/auth/tenancy")
const {
  StaticDatabases,
  generateNewUsageQuotaDoc,
} = require("@budibase/auth/db")

exports.Properties = {
  ROW: "rows", // mostly works - disabled - app / table deletion not yet accounted for
  UPLOAD: "storage", // doesn't work yet
  VIEW: "views", // doesn't work yet
  USER: "users", // doesn't work yet
  AUTOMATION: "automationRuns", // doesn't work yet
  APPS: "apps", // works
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
 * @returns {Promise<void>} When this completes the API key will now be up to date - the quota period may have
 * also been reset after this call.
 */
exports.update = async (property, usage) => {
  if (!env.USE_QUOTAS) {
    return
  }

  try {
    const db = getGlobalDB()
    const quota = await exports.getUsageQuotaDoc(db)

    // increment the quota
    quota.usageQuota[property] += usage

    if (quota.usageQuota[property] > quota.usageLimits[property]) {
      throw new Error(
        `You have exceeded your usage quota of ${quota.usageLimits[property]} ${property}.`
      )
    }

    // update the usage quotas
    await db.put(quota)
  } catch (err) {
    console.error(`Error updating usage quotas for ${property}`, err)
    throw err
  }
}
