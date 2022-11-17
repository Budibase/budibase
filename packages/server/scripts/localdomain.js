#!/usr/bin/env node
const updateDotEnv = require("update-dotenv")

const arg = process.argv.slice(2)[0]
const isEnable = arg === "enable"

let domain = process.argv.slice(2)[1]
if (!domain) {
  domain = "local.com"
}

const getAccountPortalUrl = () => {
  if (isEnable) {
    return `http://account.${domain}:10001`
  } else {
    return `http://localhost:10001`
  }
}

const getBudibaseUrl = () => {
  if (isEnable) {
    return `http://${domain}:10000`
  } else {
    return `http://localhost:10000`
  }
}

const getCookieDomain = () => {
  if (isEnable) {
    return `.${domain}`
  } else {
    return ""
  }
}

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
  ACCOUNT_PORTAL_URL: getAccountPortalUrl(),
  COOKIE_DOMAIN: getCookieDomain(),
  PLATFORM_URL: getBudibaseUrl(),
}).then(() => console.log("Updated server!"))
