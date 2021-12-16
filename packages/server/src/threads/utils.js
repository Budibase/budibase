const env = require("../environment")
const CouchDB = require("../db")
const { init } = require("@budibase/auth")
const redis = require("@budibase/auth/redis")
const { SEPARATOR } = require("@budibase/auth/db")

let client

if (!client) {
  client = await new redis.Client(redis.utils.Databases.QUERY_VARS).init()
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
  await client.get(makeVariableKey(queryId, variable))
}
