#!/usr/bin/env node
const updateDotEnv = require("update-dotenv")

const arg = process.argv.slice(2)[0]

updateDotEnv({
  SELF_HOSTED: arg === "enable" ? "1" : "0",
}).then(() => console.log("Updated server!"))
