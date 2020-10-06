const CouchDB = require("../db")
const environment = require("../environment")
const { apiKeyTable } = require("../db/dynamoClient")

// a normalised month in milliseconds
const QUOTA_RESET = 2592000000

// currently only counting new writes and deletes
const METHOD_MAP = {
  POST: 1,
  DELETE: -1,
}

const DOMAIN_MAP = {
  models: "model",
  records: "record",
}

function buildUpdateParams(key, property, usage) {
  return {
    primary: key,
    condition: "#quota.#prop + :usage < #limits.model AND #quotaReset < :now",
    expression: "ADD #quota.#prop :usage",
    names: {
      "#quota": "usageQuota",
      "#prop": property,
      "#limits": "limits",
      "#quotaReset": "quotaReset",
    },
    values: {
      ":usage": usage,
      ":now": Date.now(),
    },
  }
}

module.exports = async (ctx, next) => {
  const db = new CouchDB(ctx.user.instanceId)
  const usage = METHOD_MAP[ctx.req.method]
  const domainParts = ctx.req.url.split("/")
  const property = DOMAIN_MAP[domainParts[domainParts.length - 1]]
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
  // don't try validate in builder
  if (!environment.CLOUD) {
    return next()
  }
  try {
    await apiKeyTable.update(buildUpdateParams(ctx.apiKey, property, usage))
  } catch (err) {
    if (err.code !== "ConditionalCheckFailedException") {
      // get the API key so we can check it
      let apiKey = await apiKeyTable.get({ primary: ctx.apiKey })
      // we have infact breached the reset period
      if (apiKey && apiKey.quotaReset >= Date.now()) {
        // update the quota reset period and reset the values for all properties
        apiKey.quotaReset = Date.now() + QUOTA_RESET
        for (let prop of Object.keys(apiKey.usageQuota)) {
          apiKey.usageQuota[prop] = 0
        }
        await apiKeyTable.put({ item: apiKey })
      }
      ctx.throw(403, `Resource limits have been reached`)
    }
  }
}