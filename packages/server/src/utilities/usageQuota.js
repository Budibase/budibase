const environment = require("../environment")
const { apiKeyTable } = require("../db/dynamoClient")

const DEFAULT_USAGE = {
  records: 0,
  storage: 0,
  views: 0,
  automationRuns: 0,
  users: 0,
}

const DEFAULT_PLAN = {
  records: 1000,
  // 1 GB
  storage: 8589934592,
  views: 10,
  automationRuns: 100,
  users: 10000,
}

function buildUpdateParams(key, property, usage) {
  return {
    primary: key,
    condition:
      "attribute_exists(#quota) AND attribute_exists(#limits) AND #quota.#prop < #limits.#prop AND #quotaReset > :now",
    expression: "ADD #quota.#prop :usage",
    names: {
      "#quota": "usageQuota",
      "#prop": property,
      "#limits": "usageLimits",
      "#quotaReset": "quotaReset",
    },
    values: {
      ":usage": usage,
      ":now": Date.now(),
    },
  }
}

function getNewQuotaReset() {
  return Date.now() + 2592000000
}

exports.Properties = {
  RECORD: "records",
  UPLOAD: "storage",
  VIEW: "views",
  USER: "users",
  AUTOMATION: "automationRuns",
}

exports.getAPIKey = async appId => {
  return apiKeyTable.get({ primary: appId })
}

/**
 * Given a specified API key this will add to the usage object for the specified property.
 * @param {string} apiKey The API key which is to be updated.
 * @param {string} property The property which is to be added to (within the nested usageQuota object).
 * @param {number} usage The amount (this can be negative) to adjust the number by.
 * @returns {Promise<void>} When this completes the API key will now be up to date - the quota period may have
 * also been reset after this call.
 */
exports.update = async (apiKey, property, usage) => {
  // don't try validate in builder
  if (!environment.CLOUD) {
    return
  }
  try {
    await apiKeyTable.update(buildUpdateParams(apiKey, property, usage))
  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      // get the API key so we can check it
      const keyObj = await apiKeyTable.get({ primary: apiKey })
      // the usage quota or usage limits didn't exist
      if (keyObj && (keyObj.usageQuota == null || keyObj.usageLimits == null)) {
        keyObj.usageQuota = DEFAULT_USAGE
        keyObj.usageLimits = DEFAULT_PLAN
        keyObj.quotaReset = getNewQuotaReset()
        await apiKeyTable.put({ item: keyObj })
        return
      }
      // we have infact breached the reset period
      else if (keyObj && keyObj.quotaReset <= Date.now()) {
        // update the quota reset period and reset the values for all properties
        keyObj.quotaReset = getNewQuotaReset()
        for (let prop of Object.keys(keyObj.usageQuota)) {
          if (prop === property) {
            keyObj.usageQuota[prop] = usage > 0 ? usage : 0
          } else {
            keyObj.usageQuota[prop] = 0
          }
        }
        await apiKeyTable.put({ item: keyObj })
        return
      }
    }
    throw err
  }
}
