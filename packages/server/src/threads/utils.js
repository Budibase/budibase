const env = require("../environment")
const CouchDB = require("../db")
const { init } = require("@budibase/backend-core")
const redis = require("@budibase/backend-core/redis")
const { SEPARATOR } = require("@budibase/backend-core/db")

const VARIABLE_TTL_SECONDS = 3600
let client

async function getClient() {
  if (!client) {
    client = await new redis.Client(redis.utils.Databases.QUERY_VARS).init()
  }
  return client
}

process.on("exit", async () => {
  if (client) await client.finish()
})

exports.threadSetup = () => {
  // don't run this if not threading
  if (env.isTest() || env.DISABLE_THREADING) {
    return
  }
  // when thread starts, make sure it is recorded
  env.setInThread()
  init(CouchDB)
}

function makeVariableKey(queryId, variable) {
  return `${queryId}${SEPARATOR}${variable}`
}

exports.checkCacheForDynamicVariable = async (queryId, variable) => {
  const cache = await getClient()
  return cache.get(makeVariableKey(queryId, variable))
}

exports.invalidateDynamicVariables = async cachedVars => {
  const cache = await getClient()
  let promises = []
  for (let variable of cachedVars) {
    promises.push(
      cache.delete(makeVariableKey(variable.queryId, variable.name))
    )
  }
  await Promise.all(promises)
}

exports.storeDynamicVariable = async (queryId, variable, value) => {
  const cache = await getClient()
  await cache.store(
    makeVariableKey(queryId, variable),
    value,
    VARIABLE_TTL_SECONDS
  )
}

exports.formatResponse = resp => {
  if (typeof resp === "string") {
    try {
      resp = JSON.parse(resp)
    } catch (err) {
      resp = { response: resp }
    }
  }
  return resp
}

exports.hasExtraData = response => {
  return (
    typeof response === "object" &&
    !Array.isArray(response) &&
    response.data != null &&
    response.info != null
  )
}
