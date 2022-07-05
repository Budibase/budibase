const Client = require("./index")
const utils = require("./utils")
const { getRedlock } = require("./redlock")

let userClient, sessionClient, appClient, cacheClient, writethroughClient
let migrationsRedlock

// turn retry off so that only one instance can ever hold the lock
const migrationsRedlockConfig = { retryCount: 0 }

async function init() {
  userClient = await new Client(utils.Databases.USER_CACHE).init()
  sessionClient = await new Client(utils.Databases.SESSIONS).init()
  appClient = await new Client(utils.Databases.APP_METADATA).init()
  cacheClient = await new Client(utils.Databases.GENERIC_CACHE).init()
  writethroughClient = await new Client(
    utils.Databases.WRITE_THROUGH,
    utils.SelectableDatabases.WRITE_THROUGH
  ).init()
  // pass the underlying ioredis client to redlock
  migrationsRedlock = getRedlock(
    cacheClient.getClient(),
    migrationsRedlockConfig
  )
}

process.on("exit", async () => {
  if (userClient) await userClient.finish()
  if (sessionClient) await sessionClient.finish()
  if (appClient) await appClient.finish()
  if (cacheClient) await cacheClient.finish()
  if (writethroughClient) await writethroughClient.finish()
})

module.exports = {
  getUserClient: async () => {
    if (!userClient) {
      await init()
    }
    return userClient
  },
  getSessionClient: async () => {
    if (!sessionClient) {
      await init()
    }
    return sessionClient
  },
  getAppClient: async () => {
    if (!appClient) {
      await init()
    }
    return appClient
  },
  getCacheClient: async () => {
    if (!cacheClient) {
      await init()
    }
    return cacheClient
  },
  getWritethroughClient: async () => {
    if (!writethroughClient) {
      await init()
    }
    return writethroughClient
  },
  getMigrationsRedlock: async () => {
    if (!migrationsRedlock) {
      await init()
    }
    return migrationsRedlock
  },
}
