const redis = require("../redis/authRedis")
const { getTenantId } = require("../context")

exports.CacheKeys = {
  CHECKLIST: "checklist",
  INSTALLATION: "installation",
  ANALYTICS_ENABLED: "analyticsEnabled",
  UNIQUE_TENANT_ID: "uniqueTenantId",
  EVENTS: "events",
  BACKFILL_METADATA: "backfillMetadata",
}

exports.TTL = {
  ONE_MINUTE: 600,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
}

function generateTenantKey(key) {
  const tenantId = getTenantId()
  return `${key}:${tenantId}`
}

exports.keys = async pattern => {
  const client = await redis.getCacheClient()
  return client.keys(pattern)
}

/**
 * Read only from the cache.
 */
exports.get = async (key, opts = { useTenancy: true }) => {
  key = opts.useTenancy ? generateTenantKey(key) : key
  const client = await redis.getCacheClient()
  const value = await client.get(key)
  return value
}

/**
 * Write to the cache.
 */
exports.store = async (key, value, ttl, opts = { useTenancy: true }) => {
  key = opts.useTenancy ? generateTenantKey(key) : key
  const client = await redis.getCacheClient()
  await client.store(key, value, ttl)
}

exports.delete = async (key, opts = { useTenancy: true }) => {
  key = opts.useTenancy ? generateTenantKey(key) : key
  const client = await redis.getCacheClient()
  return client.delete(key)
}

/**
 * Read from the cache. Write to the cache if not exists.
 */
exports.withCache = async (key, ttl, fetchFn, opts = { useTenancy: true }) => {
  const cachedValue = await exports.get(key, opts)
  if (cachedValue) {
    return cachedValue
  }

  try {
    const fetchedValue = await fetchFn()

    await exports.store(key, fetchedValue, ttl, opts)
    return fetchedValue
  } catch (err) {
    console.error("Error fetching before cache - ", err)
    throw err
  }
}

exports.bustCache = async key => {
  const client = await redis.getCacheClient()
  try {
    await client.delete(generateTenantKey(key))
  } catch (err) {
    console.error("Error busting cache - ", err)
    throw err
  }
}
