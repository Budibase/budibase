const { join } = require("path")

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
  require("dotenv").config({
    path: join(__dirname, "..", ".env"),
  })
  LOADED = true
}

function parseIntSafe(number: any) {
  if (number) {
    return parseInt(number)
  }
}

const env = {
  // auth
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  // urls
  MINIO_URL: process.env.MINIO_URL,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  REDIS_URL: process.env.REDIS_URL,
  ACCOUNT_PORTAL_URL: process.env.ACCOUNT_PORTAL_URL,
  PLATFORM_URL: process.env.PLATFORM_URL,
  APPS_URL: process.env.APPS_URL,
  // ports
  // prefer worker port to generic port
  PORT: process.env.WORKER_PORT || process.env.PORT,
  CLUSTER_PORT: process.env.CLUSTER_PORT,
  // flags
  NODE_ENV: process.env.NODE_ENV,
  SELF_HOSTED: !!parseInt(process.env.SELF_HOSTED || ""),
  LOG_LEVEL: process.env.LOG_LEVEL,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  DISABLE_ACCOUNT_PORTAL: process.env.DISABLE_ACCOUNT_PORTAL,
  SMTP_FALLBACK_ENABLED: process.env.SMTP_FALLBACK_ENABLED,
  DISABLE_DEVELOPER_LICENSE: process.env.DISABLE_DEVELOPER_LICENSE,
  // smtp
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_FROM_ADDRESS: process.env.SMTP_FROM_ADDRESS,
  // other
  CHECKLIST_CACHE_TTL: parseIntSafe(process.env.CHECKLIST_CACHE_TTL) || 3600,
  SESSION_UPDATE_PERIOD: process.env.SESSION_UPDATE_PERIOD,
  ENCRYPTED_TEST_PUBLIC_API_KEY: process.env.ENCRYPTED_TEST_PUBLIC_API_KEY,
  _set(key: any, value: any) {
    process.env[key] = value
    module.exports[key] = value
  },
  isDev,
  isTest,
  isProd: () => {
    return !isDev()
  },
}

// if some var haven't been set, define them
if (!env.APPS_URL) {
  env.APPS_URL = isDev() ? "http://localhost:4001" : "http://app-service:4002"
}

// clean up any environment variable edge cases
for (let [key, value] of Object.entries(module.exports)) {
  // handle the edge case of "0" to disable an environment variable
  if (value === "0") {
    // @ts-ignore
    env[key] = 0
  }
}

export = env
