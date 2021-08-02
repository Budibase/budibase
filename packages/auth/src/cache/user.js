const redis = require("../redis/authRedis")
const {
  updateTenantId,
  lookupTenantId,
  getGlobalDB,
  isTenantIdSet,
} = require("../tenancy")

const EXPIRY_SECONDS = 3600

exports.getUser = async userId => {
  if (!isTenantIdSet()) {
    updateTenantId(await lookupTenantId(userId))
  }
  const client = await redis.getUserClient()
  // try cache
  let user = await client.get(userId)
  if (!user) {
    user = await getGlobalDB().get(userId)
    client.store(userId, user, EXPIRY_SECONDS)
  }
  return user
}

exports.invalidateUser = async userId => {
  const client = await redis.getUserClient()
  await client.delete(userId)
}
