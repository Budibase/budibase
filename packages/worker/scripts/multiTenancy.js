#!/usr/bin/env node
const updateDotEnv = require("update-dotenv")

const arg = process.argv.slice(2)[0]

updateDotEnv({
  MULTI_TENANCY: arg === "enable" ? "1" : "",
}).then(() => console.log("Updated worker!"))
