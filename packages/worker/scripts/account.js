#!/usr/bin/env node
const updateDotEnv = require("update-dotenv")

const arg = process.argv.slice(2)[0]

updateDotEnv({
  DISABLE_ACCOUNT_PORTAL: arg === "enable" ? "" : "1",
}).then(() => console.log("Updated worker!"))
