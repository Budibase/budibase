const Redis = require("../../redis")
const utils = require("../../redis/utils")

let client

const init = async () => {
  client = await new Redis(utils.Databases.LICENSES).init()
}

const shutdown = async () => {
  if (client) {
    await client.finish()
  }
}

process.on("exit", async () => {
  await shutdown()
})

exports.getClient = async () => {
  if (!client) {
    await init()
  }
  return client
}
