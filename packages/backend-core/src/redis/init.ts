import Client from "./redis"
import * as utils from "./utils"

let userClient: Client,
  sessionClient: Client,
  appClient: Client,
  cacheClient: Client,
  writethroughClient: Client,
  lockClient: Client

async function init() {
  userClient = await new Client(utils.Databases.USER_CACHE).init()
  sessionClient = await new Client(utils.Databases.SESSIONS).init()
  appClient = await new Client(utils.Databases.APP_METADATA).init()
  cacheClient = await new Client(utils.Databases.GENERIC_CACHE).init()
  lockClient = await new Client(utils.Databases.LOCKS).init()
  writethroughClient = await new Client(
    utils.Databases.WRITE_THROUGH,
    utils.SelectableDatabase.WRITE_THROUGH
  ).init()
}

process.on("exit", async () => {
  if (userClient) await userClient.finish()
  if (sessionClient) await sessionClient.finish()
  if (appClient) await appClient.finish()
  if (cacheClient) await cacheClient.finish()
  if (writethroughClient) await writethroughClient.finish()
  if (lockClient) await lockClient.finish()
})

export async function getUserClient() {
  if (!userClient) {
    await init()
  }
  return userClient
}

export async function getSessionClient() {
  if (!sessionClient) {
    await init()
  }
  return sessionClient
}

export async function getAppClient() {
  if (!appClient) {
    await init()
  }
  return appClient
}

export async function getCacheClient() {
  if (!cacheClient) {
    await init()
  }
  return cacheClient
}

export async function getWritethroughClient() {
  if (!writethroughClient) {
    await init()
  }
  return writethroughClient
}

export async function getLockClient() {
  if (!lockClient) {
    await init()
  }
  return lockClient
}
