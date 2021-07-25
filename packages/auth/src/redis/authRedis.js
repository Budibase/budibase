const Client = require("./index")
const utils = require("./utils")

let userClient, sessionClient

async function init() {
  userClient = await new Client(utils.Databases.USER_CACHE).init()
  sessionClient = await new Client(utils.Databases.SESSIONS).init()
}

process.on("exit", async () => {
  if (userClient) await userClient.finish()
  if (sessionClient) await sessionClient.finish()
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
}
