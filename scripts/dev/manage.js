#!/usr/bin/env node
const { parsed: existingConfig } = require("dotenv").config()
const updateDotEnv = require("update-dotenv")

async function init() {
  let config = {
    SELF_HOSTED: "1",
    APPS_PORT: "4001",
    WORKER_PORT: "4002",
    CLUSTER_PORT: "10000",
    JWT_SECRET: "testsecret",
    ENCRYPTION_KEY: "testsecret",
    INTERNAL_API_KEY: "budibase",
    MINIO_ACCESS_KEY: "budibase",
    MINIO_SECRET_KEY: "budibase",
    REDIS_URL: "localhost:6379",
    REDIS_PASSWORD: "budibase",
    MINIO_URL: "http://localhost:4004",
    COUCH_DB_URL: "http://budibase:budibase@localhost:4005",
    COUCH_DB_USERNAME: "budibase",
    COUCH_DB_PASSWORD: "budibase",
    // empty string is false
    MULTI_TENANCY: "",
    DISABLE_ACCOUNT_PORTAL: "1",
    ACCOUNT_PORTAL_URL: "http://localhost:10001",
    ACCOUNT_PORTAL_API_KEY: "budibase",
    PLATFORM_URL: "http://localhost:10000",
    APPS_URL: "http://localhost:4001",
    WORKER_URL: "http://localhost:4002",
    APPS_SERVICE: "app-service",
    WORKER_SERVICE: "worker-service",
    DEPLOYMENT_ENVIRONMENT: "development",
    ENABLE_EMAIL_TEST_MODE: "1",
    HTTP_LOGGING: "0",
    VERSION: "0.0.0+local",
    PASSWORD_MIN_LENGTH: "1",
    BB_ADMIN_USER_EMAIL: "",
    BB_ADMIN_USER_PASSWORD: "",
    PLUGINS_DIR: "",
    BUDICLOUD_URL: "https://budibaseqa.app",
  }

  config = { ...config, ...existingConfig }

  await updateDotEnv(config)
}

init().then(() => {
  console.log(".env checked! 🎉")
})
