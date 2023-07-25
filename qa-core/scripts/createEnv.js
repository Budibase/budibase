#!/usr/bin/env node
const path = require("path")
const fs = require("fs")

function init() {
  const envFilePath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envFilePath)) {
    const envFileJson = {
      BUDIBASE_URL: "http://localhost:10000",
      ACCOUNT_PORTAL_URL: "http://localhost:10001",
      ACCOUNT_PORTAL_API_KEY: "budibase",
      BB_ADMIN_USER_EMAIL: "admin",
      BB_ADMIN_USER_PASSWORD: "admin",
      LOG_LEVEL: "info",
      JEST_TIMEOUT: "60000",
      DISABLE_PINO_LOGGER: "1",
    }
    let envFile = ""
    Object.keys(envFileJson).forEach(key => {
      envFile += `${key}=${envFileJson[key]}\n`
    })
    fs.writeFileSync(envFilePath, envFile)
  }
}

init()
