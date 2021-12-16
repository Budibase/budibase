const env = require("../environment")
const CouchDB = require("../db")
const { init } = require("@budibase/auth")
const redis = require("@budibase/auth/redis")
const { SEPARATOR } = require("@budibase/auth/db")

let client

async function startup() {
  if (!client) {
    client = await new redis.Client(redis.utils.Databases.QUERY_VARS).init()
  }
}

process.on("exit", async () => {
  if (client) await client.finish()
})

exports.threadSetup = async () => {
  // don't run this if not threading
  if (env.isTest() || env.DISABLE_THREADING) {
    return
  }
  // when thread starts, make sure it is recorded
  env.setInThread()
  init(CouchDB)
  startup().catch(err => {
    console.error("Redis connection failed for thread - " + err)
  })
}

function makeVariableKey(queryId, variable) {
  return `${queryId}${SEPARATOR}${variable}`
}

exports.checkCacheForDynamicVariable = async (queryId, variable) => {
  await client.get(makeVariableKey(queryId, variable))
}
