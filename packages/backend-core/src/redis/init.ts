import Client from "./redis"
import * as utils from "./utils"

let userClient: Client,
  sessionClient: Client,
  appClient: Client,
  cacheClient: Client,
  writethroughClient: Client,
  lockClient: Client,
  socketClient: Client,
  inviteClient: Client,
  passwordResetClient: Client,
  docWritethroughClient: Client

export async function init() {
  userClient = await new Client(utils.Databases.USER_CACHE).init()
  sessionClient = await new Client(utils.Databases.SESSIONS).init()
  appClient = await new Client(utils.Databases.APP_METADATA).init()
  cacheClient = await new Client(utils.Databases.GENERIC_CACHE).init()
  lockClient = await new Client(utils.Databases.LOCKS).init()
  writethroughClient = await new Client(utils.Databases.WRITE_THROUGH).init()
  inviteClient = await new Client(utils.Databases.INVITATIONS).init()
  passwordResetClient = await new Client(utils.Databases.PW_RESETS).init()
  socketClient = await new Client(
    utils.Databases.SOCKET_IO,
    utils.SelectableDatabase.SOCKET_IO
  ).init()
  docWritethroughClient = await new Client(
    utils.Databases.DOC_WRITE_THROUGH
  ).init()
}

export async function shutdown() {
  if (userClient) await userClient.finish()
  if (sessionClient) await sessionClient.finish()
  if (appClient) await appClient.finish()
  if (cacheClient) await cacheClient.finish()
  if (writethroughClient) await writethroughClient.finish()
  if (lockClient) await lockClient.finish()
  if (inviteClient) await inviteClient.finish()
  if (passwordResetClient) await passwordResetClient.finish()
  if (socketClient) await socketClient.finish()
  if (docWritethroughClient) await docWritethroughClient.finish()
}

process.on("exit", async () => {
  await shutdown()
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

export async function getSocketClient() {
  if (!socketClient) {
    await init()
  }
  return socketClient
}

export async function getInviteClient() {
  if (!inviteClient) {
    await init()
  }
  return inviteClient
}

export async function getPasswordResetClient() {
  if (!passwordResetClient) {
    await init()
  }
  return passwordResetClient
}

export async function getDocWritethroughClient() {
  if (!writethroughClient) {
    await init()
  }
  return writethroughClient
}
