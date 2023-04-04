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
}

export = env
