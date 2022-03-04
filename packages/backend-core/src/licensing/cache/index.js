const redis = require("./redis")
const env = require("../../environment")
const accounts = require("../../cloud/accounts")

const EXPIRY_SECONDS = 3600

const populateLicense = async tenantId => {
  if (env.SELF_HOSTED) {
    // get license key
  } else {
    return accounts.getLicense(tenantId)
  }
}

exports.getLicense = async (tenantId, opts = { populateLicense: null }) => {
  // try cache
  const client = await redis.getClient()
  let license = await client.get(tenantId)
  if (!license) {
    const populate = opts.populateLicense
      ? opts.populateLicense
      : populateLicense
    license = await populate(tenantId)
    if (license) {
      client.store(tenantId, license, EXPIRY_SECONDS)
    }
  }

  return license
}

exports.invalidate = async tenantId => {
  const client = await redis.getClient()
  await client.delete(tenantId)
}
