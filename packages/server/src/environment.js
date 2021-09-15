function isTest() {
  return (
    process.env.NODE_ENV === "jest" ||
    process.env.NODE_ENV === "cypress" ||
    process.env.JEST_WORKER_ID != null
  )
}

function isDev() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.BUDIBASE_ENVIRONMENT !== "production"
  )
}

let LOADED = false
if (!LOADED && isDev() && !isTest()) {
  require("dotenv").config()
  LOADED = true
}

module.exports = {
  // important
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  MINIO_URL: process.env.MINIO_URL,
  WORKER_URL: process.env.WORKER_URL,
  SELF_HOSTED: process.env.SELF_HOSTED,
  AWS_REGION: process.env.AWS_REGION,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  USE_QUOTAS: process.env.USE_QUOTAS,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  // environment
  NODE_ENV: process.env.NODE_ENV,
  JEST_WORKER_ID: process.env.JEST_WORKER_ID,
  BUDIBASE_ENVIRONMENT: process.env.BUDIBASE_ENVIRONMENT,
  // minor
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  LOGGER: process.env.LOGGER,
  LOG_LEVEL: process.env.LOG_LEVEL,
  AUTOMATION_DIRECTORY: process.env.AUTOMATION_DIRECTORY,
  AUTOMATION_BUCKET: process.env.AUTOMATION_BUCKET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
  // old - to remove
  CLIENT_ID: process.env.CLIENT_ID,
  BUDIBASE_DIR: process.env.BUDIBASE_DIR,
  DEPLOYMENT_DB_URL: process.env.DEPLOYMENT_DB_URL,
  BUDIBASE_API_KEY: process.env.BUDIBASE_API_KEY,
  USERID_API_KEY: process.env.USERID_API_KEY,
  DEPLOYMENT_CREDENTIALS_URL: process.env.DEPLOYMENT_CREDENTIALS_URL,
  ALLOW_DEV_AUTOMATIONS: process.env.ALLOW_DEV_AUTOMATIONS,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
  isTest,
  isDev,
  isProd: () => {
    return !isDev()
  },
}
