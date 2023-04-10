import { join } from "path"

let LOADED = false
if (!LOADED) {
  require("dotenv").config({
    path: join(__dirname, "..", ".env"),
  })
  LOADED = true
}

const env = {
  BUDIBASE_URL: process.env.BUDIBASE_URL,
  ACCOUNT_PORTAL_URL: process.env.ACCOUNT_PORTAL_URL,
  BB_ADMIN_USER_EMAIL: process.env.BB_ADMIN_USER_EMAIL,
  BB_ADMIN_USER_PASSWORD: process.env.BB_ADMIN_USER_PASSWORD,
}

export = env
