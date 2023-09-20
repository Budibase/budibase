import { env as coreEnv } from "@budibase/backend-core"
import { ServiceType } from "@budibase/types"
coreEnv._set("SERVICE_TYPE", ServiceType.APPS)
import { join } from "path"

let LOADED = false
if (!LOADED && coreEnv.isDev() && !coreEnv.isTest()) {
  require("dotenv").config({
    path: join(__dirname, "..", ".env"),
  })
  LOADED = true
}

function parseIntSafe(number?: string) {
  if (number) {
    return parseInt(number)
  }
}

const environment = {
  // features
  APP_FEATURES: process.env.APP_FEATURES,
  // important - prefer app port to generic port
  PORT: process.env.APP_PORT || process.env.PORT,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  MINIO_URL: process.env.MINIO_URL,
  WORKER_URL: process.env.WORKER_URL,
  AWS_REGION: process.env.AWS_REGION,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_CLUSTERED: process.env.REDIS_CLUSTERED,
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
  ACCOUNT_PORTAL_URL: process.env.ACCOUNT_PORTAL_URL,
  AUTOMATION_MAX_ITERATIONS:
    parseIntSafe(process.env.AUTOMATION_MAX_ITERATIONS) || 200,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
  QUERY_THREAD_TIMEOUT: parseIntSafe(process.env.QUERY_THREAD_TIMEOUT),
  SQL_MAX_ROWS: process.env.SQL_MAX_ROWS,
  BB_ADMIN_USER_EMAIL: process.env.BB_ADMIN_USER_EMAIL,
  BB_ADMIN_USER_PASSWORD: process.env.BB_ADMIN_USER_PASSWORD,
  PLUGINS_DIR: process.env.PLUGINS_DIR || "/plugins",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  // flags
  ALLOW_DEV_AUTOMATIONS: process.env.ALLOW_DEV_AUTOMATIONS,
  DISABLE_THREADING: process.env.DISABLE_THREADING,
  DISABLE_AUTOMATION_LOGS: process.env.DISABLE_AUTOMATION_LOGS,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  SELF_HOSTED: process.env.SELF_HOSTED,
  HTTP_MB_LIMIT: process.env.HTTP_MB_LIMIT,
  FORKED_PROCESS_NAME: process.env.FORKED_PROCESS_NAME || "main",
  // old
  CLIENT_ID: process.env.CLIENT_ID,
  _set(key: string, value: any) {
    process.env[key] = value
    // @ts-ignore
    environment[key] = value
  },
  isTest: coreEnv.isTest,
  isJest: coreEnv.isJest,

  isDev: coreEnv.isDev,
  isProd: () => {
    return !coreEnv.isDev()
  },
  isInThread: () => {
    return process.env.FORKED_PROCESS
  },
  TOP_LEVEL_PATH:
    process.env.TOP_LEVEL_PATH || process.env.SERVER_TOP_LEVEL_PATH,
}

// threading can cause memory issues with node-ts in development
if (coreEnv.isDev() && environment.DISABLE_THREADING == null) {
  environment._set("DISABLE_THREADING", "1")
}

// clean up any environment variable edge cases
for (let [key, value] of Object.entries(environment)) {
  // handle the edge case of "0" to disable an environment variable
  if (value === "0") {
    // @ts-ignore
    environment[key] = 0
  }
  // handle the edge case of "false" to disable an environment variable
  if (value === "false") {
    // @ts-ignore
    environment[key] = 0
  }
}

export default environment
