function isTest() {
  return isCypress() || isJest()
}

function isJest() {
  return !!(process.env.NODE_ENV === "jest" || process.env.JEST_WORKER_ID)
}

function isCypress() {
  return process.env.NODE_ENV === "cypress"
}

function isDev() {
  return process.env.NODE_ENV !== "production"
}

let LOADED = false
if (!LOADED && isDev() && !isTest()) {
  require("dotenv").config()
  LOADED = true
}

const DefaultBucketName = {
  BACKUPS: "backups",
  APPS: "prod-budi-app-assets",
  TEMPLATES: "templates",
  GLOBAL: "global",
  PLUGINS: "plugins",
}

const environment = {
  isTest,
  isJest,
  isDev,
  isProd: () => {
    return !isDev()
  },
  JS_BCRYPT: process.env.JS_BCRYPT,
  JWT_SECRET: process.env.JWT_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  COUCH_DB_URL: process.env.COUCH_DB_URL || "http://localhost:4005",
  COUCH_DB_USERNAME: process.env.COUCH_DB_USER,
  COUCH_DB_PASSWORD: process.env.COUCH_DB_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
  MINIO_URL: process.env.MINIO_URL,
  MINIO_ENABLED: process.env.MINIO_ENABLED || 1,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  ACCOUNT_PORTAL_URL:
    process.env.ACCOUNT_PORTAL_URL || "https://account.budibase.app",
  ACCOUNT_PORTAL_API_KEY: process.env.ACCOUNT_PORTAL_API_KEY || "",
  DISABLE_ACCOUNT_PORTAL: process.env.DISABLE_ACCOUNT_PORTAL,
  SELF_HOSTED: !!parseInt(process.env.SELF_HOSTED || ""),
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  PLATFORM_URL: process.env.PLATFORM_URL || "",
  POSTHOG_TOKEN: process.env.POSTHOG_TOKEN,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  TENANT_FEATURE_FLAGS: process.env.TENANT_FEATURE_FLAGS,
  CLOUDFRONT_CDN: process.env.CLOUDFRONT_CDN,
  CLOUDFRONT_PRIVATE_KEY_64: process.env.CLOUDFRONT_PRIVATE_KEY_64,
  CLOUDFRONT_PUBLIC_KEY_ID: process.env.CLOUDFRONT_PUBLIC_KEY_ID,
  BACKUPS_BUCKET_NAME:
    process.env.BACKUPS_BUCKET_NAME || DefaultBucketName.BACKUPS,
  APPS_BUCKET_NAME: process.env.APPS_BUCKET_NAME || DefaultBucketName.APPS,
  TEMPLATES_BUCKET_NAME:
    process.env.TEMPLATES_BUCKET_NAME || DefaultBucketName.TEMPLATES,
  GLOBAL_BUCKET_NAME:
    process.env.GLOBAL_BUCKET_NAME || DefaultBucketName.GLOBAL,
  PLUGIN_BUCKET_NAME:
    process.env.PLUGIN_BUCKET_NAME || DefaultBucketName.PLUGINS,
  USE_COUCH: process.env.USE_COUCH || true,
  DEFAULT_LICENSE: process.env.DEFAULT_LICENSE,
  SERVICE: process.env.SERVICE || "budibase",
  LOG_LEVEL: process.env.LOG_LEVEL,
  SESSION_UPDATE_PERIOD: process.env.SESSION_UPDATE_PERIOD,
  DEPLOYMENT_ENVIRONMENT:
    process.env.DEPLOYMENT_ENVIRONMENT || "docker-compose",
  _set(key: any, value: any) {
    process.env[key] = value
    // @ts-ignore
    environment[key] = value
  },
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
