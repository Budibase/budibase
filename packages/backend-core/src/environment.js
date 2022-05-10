function isTest() {
  return (
    process.env.NODE_ENV === "jest" ||
    process.env.NODE_ENV === "cypress" ||
    process.env.JEST_WORKER_ID != null
  )
}

function isDev() {
  return process.env.NODE_ENV !== "production"
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
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
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
  MULTI_TENANCY: process.env.MULTI_TENANCY,
  ACCOUNT_PORTAL_URL:
    process.env.ACCOUNT_PORTAL_URL || "https://account.budibase.app",
  ACCOUNT_PORTAL_API_KEY: process.env.ACCOUNT_PORTAL_API_KEY,
  DISABLE_ACCOUNT_PORTAL: process.env.DISABLE_ACCOUNT_PORTAL,
  SELF_HOSTED: !!parseInt(process.env.SELF_HOSTED),
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  PLATFORM_URL: process.env.PLATFORM_URL,
  TENANT_FEATURE_FLAGS: process.env.TENANT_FEATURE_FLAGS,
  BACKUPS_BUCKET_NAME: process.env.BACKUPS_BUCKET_NAME || "backups",
  APPS_BUCKET_NAME: process.env.APPS_BUCKET_NAME || "prod-budi-app-assets",
  TEMPLATES_BUCKET_NAME: process.env.TEMPLATES_BUCKET_NAME || "templates",
  GLOBAL_BUCKET_NAME: process.env.GLOBAL_BUCKET_NAME || "global",
  GLOBAL_CLOUD_BUCKET_NAME:
    process.env.GLOBAL_CLOUD_BUCKET_NAME || "prod-budi-tenant-uploads",
  USE_COUCH: process.env.USE_COUCH || true,
  isTest,
  isDev,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
}

// clean up any environment variable edge cases
for (let [key, value] of Object.entries(module.exports)) {
  // handle the edge case of "0" to disable an environment variable
  if (value === "0") {
    module.exports[key] = 0
  }
}
