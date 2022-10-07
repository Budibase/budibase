#!/usr/bin/env node
const updateDotEnv = require("update-dotenv")

const arg = process.argv.slice(2)[0]

/**
 * For testing multi tenancy sub domains locally.
 *
 * Relies on an entry in /etc/hosts e.g:
 *
 * 127.0.0.1   local.com
 *
 * and an entry for each tenant you wish to test locally e.g:
 *
 * 127.0.0.1   t1.local.com
 * 127.0.0.1   t2.local.com
 */
updateDotEnv({
  ACCOUNT_PORTAL_URL:
    arg === "enable"
      ? "http://account.local.com:10001"
      : "http://localhost:10001",
  COOKIE_DOMAIN: arg === "enable" ? ".local.com" : "",
  PLATFORM_URL:
    arg === "enable" ? "http://local.com:10000" : "http://localhost:10000",
}).then(() => console.log("Updated worker!"))
