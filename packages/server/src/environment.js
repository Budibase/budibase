const { join } = require("path")

function isTest() {
  return isCypress() || isJest()
}

function isJest() {
  return (
    process.env.NODE_ENV === "jest" ||
    (process.env.JEST_WORKER_ID != null &&
      process.env.JEST_WORKER_ID !== "null")
  )
}

function isDev() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.BUDIBASE_ENVIRONMENT !== "production"
  )
}

function isCypress() {
  return process.env.NODE_ENV === "cypress"
}

let LOADED = false
if (!LOADED && isDev() && !isTest()) {
  require("dotenv").config({
    path: join(__dirname, "..", ".env"),
  })
  LOADED = true
}

function parseIntSafe(number) {
  if (number) {
    return parseInt(number)
  }
}

let inThread = false

module.exports = {
  // important
  PORT: process.env.PORT || process.env.APP_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  MINIO_URL: process.env.MINIO_URL,
  WORKER_URL: process.env.WORKER_URL,
  AWS_REGION: process.env.AWS_REGION,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  HTTP_MIGRATIONS: process.env.HTTP_MIGRATIONS,
  API_REQ_LIMIT_PER_SEC: process.env.API_REQ_LIMIT_PER_SEC,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  // environment
  NODE_ENV: process.env.NODE_ENV,
  JEST_WORKER_ID: process.env.JEST_WORKER_ID,
  BUDIBASE_ENVIRONMENT: process.env.BUDIBASE_ENVIRONMENT,
  DISABLE_ACCOUNT_PORTAL: process.env.DISABLE_ACCOUNT_PORTAL,
  TEMPLATE_REPOSITORY: process.env.TEMPLATE_REPOSITORY || "app",
  DISABLE_AUTO_PROD_APP_SYNC: process.env.DISABLE_AUTO_PROD_APP_SYNC,
  SESSION_UPDATE_PERIOD: process.env.SESSION_UPDATE_PERIOD,
  // minor
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  LOGGER: process.env.LOGGER,
  LOG_LEVEL: process.env.LOG_LEVEL,
  ACCOUNT_PORTAL_URL: process.env.ACCOUNT_PORTAL_URL,
  AUTOMATION_MAX_ITERATIONS:
    parseIntSafe(process.env.AUTOMATION_MAX_ITERATIONS) || 200,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
  QUERY_THREAD_TIMEOUT: parseIntSafe(process.env.QUERY_THREAD_TIMEOUT),
  SQL_MAX_ROWS: process.env.SQL_MAX_ROWS,
  BB_ADMIN_USER_EMAIL: process.env.BB_ADMIN_USER_EMAIL,
  BB_ADMIN_USER_PASSWORD: process.env.BB_ADMIN_USER_PASSWORD,
  // flags
  ALLOW_DEV_AUTOMATIONS: process.env.ALLOW_DEV_AUTOMATIONS,
  DISABLE_THREADING: process.env.DISABLE_THREADING,
  DISABLE_DEVELOPER_LICENSE: process.env.DISABLE_DEVELOPER_LICENSE,
  DISABLE_AUTOMATION_LOGS: process.env.DISABLE_AUTOMATION_LOGS,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  SELF_HOSTED: process.env.SELF_HOSTED,
  // old
  CLIENT_ID: process.env.CLIENT_ID,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
  isTest,
  isJest,
  isCypress,
  isDev,
  isProd: () => {
    return !isDev()
  },
  // used to check if already in a thread, don't thread further
  setInThread: () => {
    inThread = true
  },
  isInThread: () => {
    return inThread
  },
}

// threading can cause memory issues with node-ts in development
if (isDev() && module.exports.DISABLE_THREADING == null) {
  module.exports._set("DISABLE_THREADING", "1")
}

// clean up any environment variable edge cases
for (let [key, value] of Object.entries(module.exports)) {
  // handle the edge case of "0" to disable an environment variable
  if (value === "0") {
    module.exports[key] = 0
  }
}
