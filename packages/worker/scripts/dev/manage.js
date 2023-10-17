#!/usr/bin/env node
const path = require("path")
const fs = require("fs")

async function init() {
  const envFilePath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envFilePath)) {
    const envFileJson = {
      SELF_HOSTED: 1,
      PORT: 4002,
      CLUSTER_PORT: 10000,
      JWT_SECRET: "testsecret",
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
      DISABLE_ACCOUNT_PORTAL: 1,
      ACCOUNT_PORTAL_URL: "http://localhost:10001",
      ACCOUNT_PORTAL_API_KEY: "budibase",
      PLATFORM_URL: "http://localhost:10000",
      APPS_URL: "http://localhost:4001",
      SERVICE: "worker-service",
      DEPLOYMENT_ENVIRONMENT: "development",
      TENANT_FEATURE_FLAGS: "*:LICENSING,*:USER_GROUPS,*:ONBOARDING_TOUR",
      ENABLE_EMAIL_TEST_MODE: 1,
      HTTP_LOGGING: 0,
    }
    let envFile = ""
    Object.keys(envFileJson).forEach(key => {
      envFile += `${key}=${envFileJson[key]}\n`
    })
    fs.writeFileSync(envFilePath, envFile)
  }
}

// if more than init required use this to determine the command type
//const managementCommand = process.argv.slice(2)[0]

// for now only one command
let command = init

command()
  .then(() => {
    console.log("Done! 🎉")
  })
  .catch(err => {
    console.error(
      "Something went wrong while managing budibase dev worker:",
      err.message
    )
  })
