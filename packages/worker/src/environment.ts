import { env as coreEnv } from "@budibase/backend-core"
import { ServiceType } from "@budibase/types"
import { join } from "path"

coreEnv._set("SERVICE_TYPE", ServiceType.WORKER)

let LOADED = false
if (!LOADED && coreEnv.isDev() && !coreEnv.isTest()) {
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

const environment = {
  // features
  WORKER_FEATURES: process.env.WORKER_FEATURES,
  // auth
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
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
  /**
   * Mock the email service in use - links to ethereal hosted emails are logged instead.
   */
  ENABLE_EMAIL_TEST_MODE: process.env.ENABLE_EMAIL_TEST_MODE,
  PASSPORT_GOOGLEAUTH_SUCCESS_REDIRECT:
    process.env.PASSPORT_GOOGLEAUTH_SUCCESS_REDIRECT || "/",
  PASSPORT_GOOGLEAUTH_FAILURE_REDIRECT:
    process.env.PASSPORT_GOOGLEAUTH_FAILURE_REDIRECT || "/error",
  PASSPORT_OIDCAUTH_SUCCESS_REDIRECT:
    process.env.PASSPORT_OIDCAUTH_SUCCESS_REDIRECT || "/",
  PASSPORT_OIDCAUTH_FAILURE_REDIRECT:
    process.env.PASSPORT_OIDCAUTH_FAILURE_REDIRECT || "/error",

  _set(key: any, value: any) {
    process.env[key] = value
    // @ts-ignore
    environment[key] = value
  },
  isDev: coreEnv.isDev,
  isTest: coreEnv.isTest,
  isProd: () => {
    return !coreEnv.isDev()
  },
}

// if some var haven't been set, define them
if (!environment.APPS_URL) {
  environment.APPS_URL = coreEnv.isDev()
    ? "http://localhost:4001"
    : "http://app-service:4002"
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
