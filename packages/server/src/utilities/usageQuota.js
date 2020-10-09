const environment = require("../environment")
const { apiKeyTable } = require("../db/dynamoClient")

function buildUpdateParams(key, property, usage) {
  return {
    primary: key,
    condition: "#quota.#prop < #limits.#prop AND #quotaReset > :now",
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

// a normalised month in milliseconds
const QUOTA_RESET = 2592000000

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
      // we have infact breached the reset period
      if (keyObj && keyObj.quotaReset <= Date.now()) {
        // update the quota reset period and reset the values for all properties
        keyObj.quotaReset = Date.now() + QUOTA_RESET
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
      throw "Resource limits have been reached"
    }
  }
}
