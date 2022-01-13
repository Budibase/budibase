const Client = require("./index")
const utils = require("./utils")

let userClient, sessionClient, appClient

async function init() {
  userClient = await new Client(utils.Databases.USER_CACHE).init()
  sessionClient = await new Client(utils.Databases.SESSIONS).init()
  appClient = await new Client(utils.Databases.APP_METADATA).init()
}

process.on("exit", async () => {
  if (userClient) await userClient.finish()
  if (sessionClient) await sessionClient.finish()
  if (appClient) await appClient.finish()
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
}
