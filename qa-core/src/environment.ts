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
  ACCOUNT_PORTAL_API_KEY: process.env.ACCOUNT_PORTAL_API_KEY,
  BB_ADMIN_USER_EMAIL: process.env.BB_ADMIN_USER_EMAIL,
  BB_ADMIN_USER_PASSWORD: process.env.BB_ADMIN_USER_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
  MONGODB_DB: process.env.MONGODB_DB,
  REST_API_BASE_URL: process.env.REST_API_BASE_URL,
  REST_API_KEY: process.env.REST_API_KEY,
  MARIADB_HOST: process.env.MARIADB_HOST,
  MARIADB_PORT: process.env.MARIADB_PORT,
  MARIADB_DB: process.env.MARIADB_DB,
  MARIADB_USER: process.env.MARIADB_USER,
  MARIADB_PASSWORD: process.env.MARIADB_PASSWORD,
}

export = env
