const { getDB } = require("../db")
const { StaticDatabases } = require("../db/utils")
const redis = require("../redis/authRedis")

const EXPIRY_SECONDS = 3600

exports.getUser = async userId => {
  const client = await redis.getUserClient()
  // try cache
  let user = await client.get(userId)
  if (!user) {
    user = await getDB(StaticDatabases.GLOBAL.name).get(userId)
    client.store(userId, user, EXPIRY_SECONDS)
  }
  return user
}

exports.invalidateUser = async userId => {
  const client = await redis.getUserClient()
  await client.delete(userId)
}
