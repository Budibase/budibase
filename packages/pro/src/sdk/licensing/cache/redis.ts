import { redis, RedisClient } from "@budibase/backend-core"

let client: RedisClient
const init = async () => {
  client = await RedisClient.init(redis.utils.Databases.LICENSES)
}

const shutdown = async () => {
  if (client) {
    await client.finish()
  }
}

process.on("exit", async () => {
  await shutdown()
})

export const getClient = async () => {
  if (!client) {
    await init()
  }
  return client
}
