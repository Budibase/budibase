import Client from "./redis"
import * as utils from "./utils"

let userClient: Client,
  sessionClient: Client,
  workspaceClient: Client,
  cacheClient: Client,
  openapiImportSpecsClient: Client,
  writethroughClient: Client,
  lockClient: Client,
  socketClient: Client,
  inviteListClient: Client,
  passwordResetClient: Client,
  docWritethroughClient: Client

export async function init() {
  userClient = await Client.init(utils.Databases.USER_CACHE)
  sessionClient = await Client.init(utils.Databases.SESSIONS)
  workspaceClient = await Client.init(utils.Databases.WORKSPACE_METADATA)
  cacheClient = await Client.init(utils.Databases.GENERIC_CACHE)
  openapiImportSpecsClient = await Client.init(
    utils.Databases.OPENAPI_IMPORT_SPECS,
    utils.SelectableDatabase.OPENAPI_IMPORT_SPECS
  )
  lockClient = await Client.init(utils.Databases.LOCKS)
  writethroughClient = await Client.init(utils.Databases.WRITE_THROUGH)
  inviteListClient = await Client.init(utils.Databases.INVITATIONS_LIST)
  passwordResetClient = await Client.init(utils.Databases.PW_RESETS)
  socketClient = await Client.init(
    utils.Databases.SOCKET_IO,
    utils.SelectableDatabase.SOCKET_IO
  )
  docWritethroughClient = await Client.init(utils.Databases.DOC_WRITE_THROUGH)
}

export async function shutdown() {
  await userClient?.finish()
  await sessionClient?.finish()
  await workspaceClient?.finish()
  await cacheClient?.finish()
  await openapiImportSpecsClient?.finish()
  await writethroughClient?.finish()
  await lockClient?.finish()
  await inviteListClient?.finish()
  await passwordResetClient?.finish()
  await socketClient?.finish()
  await docWritethroughClient?.finish()
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

export async function getWorkspaceClient() {
  if (!workspaceClient) {
    await init()
  }
  return workspaceClient
}

export async function getCacheClient() {
  if (!cacheClient) {
    await init()
  }
  return cacheClient
}

export async function getOpenapiImportSpecsClient() {
  if (!openapiImportSpecsClient) {
    await init()
  }
  return openapiImportSpecsClient
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

export async function getInviteListClient() {
  if (!inviteListClient) {
    await init()
  }
  return inviteListClient
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
