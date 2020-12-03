const { resolve, join } = require("./utilities/centralPath")
const { homedir } = require("os")
const { app } = require("electron")

let LOADED = false

if (!LOADED) {
  const homeDir = app ? app.getPath("home") : homedir()
  const budibaseDir = join(homeDir, ".budibase")
  process.env.BUDIBASE_DIR = budibaseDir
  require("dotenv").config({ path: resolve(budibaseDir, ".env") })
  LOADED = true
}

module.exports = {
  CLIENT_ID: process.env.CLIENT_ID,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  BUDIBASE_DIR: process.env.BUDIBASE_DIR,
  PORT: process.env.PORT,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  LOGGER: process.env.LOGGER,
  LOG_LEVEL: process.env.LOG_LEVEL,
  AUTOMATION_DIRECTORY: process.env.AUTOMATION_DIRECTORY,
  AUTOMATION_BUCKET: process.env.AUTOMATION_BUCKET,
  BUDIBASE_ENVIRONMENT: process.env.BUDIBASE_ENVIRONMENT,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  CLOUD: process.env.CLOUD,
  SELF_HOSTED: process.env.SELF_HOSTED,
  DYNAMO_ENDPOINT: process.env.DYNAMO_ENDPOINT,
  AWS_REGION: process.env.AWS_REGION,
  DEPLOYMENT_CREDENTIALS_URL: process.env.DEPLOYMENT_CREDENTIALS_URL,
  BUDIBASE_API_KEY: process.env.BUDIBASE_API_KEY,
  USERID_API_KEY: process.env.USERID_API_KEY,
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
  DEPLOYMENT_DB_URL: process.env.DEPLOYMENT_DB_URL,
  LOCAL_TEMPLATES: process.env.LOCAL_TEMPLATES,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
}
