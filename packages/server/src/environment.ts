import { env as coreEnv } from "@budibase/backend-core"
import { ServiceType } from "@budibase/types"
import cloneDeep from "lodash/cloneDeep"

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

const DEFAULTS = {
  QUERY_THREAD_TIMEOUT: 15000,
  AUTOMATION_THREAD_TIMEOUT: 15000,
  AUTOMATION_SYNC_TIMEOUT: 120000,
  AUTOMATION_MAX_ITERATIONS: 200,
  JS_PER_EXECUTION_TIME_LIMIT_MS: 1500,
  TEMPLATE_REPOSITORY: "app",
  PLUGINS_DIR: "/plugins",
  FORKED_PROCESS_NAME: "main",
  JS_RUNNER_MEMORY_LIMIT: 64,
}

const QUERY_THREAD_TIMEOUT =
  parseIntSafe(process.env.QUERY_THREAD_TIMEOUT) ||
  DEFAULTS.QUERY_THREAD_TIMEOUT
const DEFAULT_AUTOMATION_TIMEOUT =
  QUERY_THREAD_TIMEOUT > DEFAULTS.AUTOMATION_THREAD_TIMEOUT
    ? QUERY_THREAD_TIMEOUT
    : DEFAULTS.AUTOMATION_THREAD_TIMEOUT
const environment = {
  // features
  APP_FEATURES: process.env.APP_FEATURES,
  // important - prefer app port to generic port
  PORT: process.env.APP_PORT || process.env.PORT,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  COUCH_DB_SQL_URL: process.env.COUCH_DB_SQL_URL,
  MINIO_URL: process.env.MINIO_URL,
  WORKER_URL: process.env.WORKER_URL,
  AWS_REGION: process.env.AWS_REGION,
  AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_CLUSTERED: process.env.REDIS_CLUSTERED,
  HTTP_MIGRATIONS: process.env.HTTP_MIGRATIONS,
  CLUSTER_MODE: process.env.CLUSTER_MODE,
  API_REQ_LIMIT_PER_SEC: process.env.API_REQ_LIMIT_PER_SEC,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  // environment
  NODE_ENV: process.env.NODE_ENV,
  JEST_WORKER_ID: process.env.JEST_WORKER_ID,
  BUDIBASE_ENVIRONMENT: process.env.BUDIBASE_ENVIRONMENT,
  DISABLE_ACCOUNT_PORTAL: process.env.DISABLE_ACCOUNT_PORTAL,
  TEMPLATE_REPOSITORY:
    process.env.TEMPLATE_REPOSITORY || DEFAULTS.TEMPLATE_REPOSITORY,
  DISABLE_AUTO_PROD_APP_SYNC: process.env.DISABLE_AUTO_PROD_APP_SYNC,
  SESSION_UPDATE_PERIOD: process.env.SESSION_UPDATE_PERIOD,
  // minor
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  LOGGER: process.env.LOGGER,
  ACCOUNT_PORTAL_URL: process.env.ACCOUNT_PORTAL_URL,
  AUTOMATION_MAX_ITERATIONS:
    parseIntSafe(process.env.AUTOMATION_MAX_ITERATIONS) ||
    DEFAULTS.AUTOMATION_MAX_ITERATIONS,
  DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
  QUERY_THREAD_TIMEOUT: QUERY_THREAD_TIMEOUT,
  AUTOMATION_THREAD_TIMEOUT:
    parseIntSafe(process.env.AUTOMATION_THREAD_TIMEOUT) ||
    DEFAULT_AUTOMATION_TIMEOUT,
  PLUGINS_DIR: process.env.PLUGINS_DIR || DEFAULTS.PLUGINS_DIR,
  MAX_IMPORT_SIZE_MB: process.env.MAX_IMPORT_SIZE_MB,
  SESSION_EXPIRY_SECONDS: process.env.SESSION_EXPIRY_SECONDS,
  XSS_SAFE_MODE: process.env.XSS_SAFE_MODE,
  // SQL
  SQL_MAX_ROWS: process.env.SQL_MAX_ROWS,
  SQL_LOGGING_ENABLE: process.env.SQL_LOGGING_ENABLE,
  SQL_ALIASING_DISABLE: process.env.SQL_ALIASING_DISABLE,
  // flags
  ALLOW_DEV_AUTOMATIONS: process.env.ALLOW_DEV_AUTOMATIONS,
  DISABLE_THREADING: process.env.DISABLE_THREADING,
  DISABLE_AUTOMATION_LOGS: process.env.DISABLE_AUTOMATION_LOGS,
  DISABLE_RATE_LIMITING: process.env.DISABLE_RATE_LIMITING,
  DISABLE_APP_MIGRATIONS: process.env.SKIP_APP_MIGRATIONS || false,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  SELF_HOSTED: process.env.SELF_HOSTED,
  HTTP_MB_LIMIT: process.env.HTTP_MB_LIMIT,
  FORKED_PROCESS_NAME:
    process.env.FORKED_PROCESS_NAME || DEFAULTS.FORKED_PROCESS_NAME,
  JS_PER_INVOCATION_TIMEOUT_MS:
    parseIntSafe(process.env.JS_PER_EXECUTION_TIME_LIMIT_MS) ||
    DEFAULTS.JS_PER_EXECUTION_TIME_LIMIT_MS,
  JS_PER_REQUEST_TIMEOUT_MS: parseIntSafe(
    process.env.JS_PER_REQUEST_TIME_LIMIT_MS
  ),
  TOP_LEVEL_PATH:
    process.env.TOP_LEVEL_PATH || process.env.SERVER_TOP_LEVEL_PATH,
  APP_MIGRATION_TIMEOUT: parseIntSafe(process.env.APP_MIGRATION_TIMEOUT),
  JS_RUNNER_MEMORY_LIMIT:
    parseIntSafe(process.env.JS_RUNNER_MEMORY_LIMIT) ||
    DEFAULTS.JS_RUNNER_MEMORY_LIMIT,
  LOG_JS_ERRORS: process.env.LOG_JS_ERRORS,
  DISABLE_USER_SYNC: process.env.DISABLE_USER_SYNC,
  // old
  CLIENT_ID: process.env.CLIENT_ID,
  _set(key: string, value: any) {
    process.env[key] = value
    // @ts-ignore
    environment[key] = value
    cleanVariables()
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
  getDefaults: () => {
    return DEFAULTS
  },
}

export function setEnv(newEnvVars: Partial<typeof environment>): () => void {
  const oldEnv = cloneDeep(environment)

  let key: keyof typeof newEnvVars
  for (key in newEnvVars) {
    environment._set(key, newEnvVars[key])
  }

  return () => {
    for (const [key, value] of Object.entries(oldEnv)) {
      environment._set(key, value)
    }
  }
}

export function withEnv<T>(envVars: Partial<typeof environment>, f: () => T) {
  const cleanup = setEnv(envVars)
  const result = f()
  if (result instanceof Promise) {
    return result.finally(cleanup)
  } else {
    cleanup()
    return result
  }
}

function cleanVariables() {
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
}

cleanVariables()

export default environment
