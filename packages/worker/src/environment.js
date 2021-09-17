function isDev() {
  return process.env.NODE_ENV !== "production"
}

function isTest() {
  return (
    process.env.NODE_ENV === "jest" ||
    process.env.NODE_ENV === "cypress" ||
    process.env.JEST_WORKER_ID != null
  )
}

let LOADED = false
if (!LOADED && isDev() && !isTest()) {
  require("dotenv").config()
  LOADED = true
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  SELF_HOSTED: process.env.SELF_HOSTED,
  PORT: process.env.PORT,
  CLUSTER_PORT: process.env.CLUSTER_PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  MINIO_URL: process.env.MINIO_URL,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  ACCOUNT_PORTAL_URL: process.env.ACCOUNT_PORTAL_URL,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
  isDev,
  isTest,
  isProd: () => {
    return !isDev()
  },
}
