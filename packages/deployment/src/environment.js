module.exports = {
  SELF_HOSTED: process.env.SELF_HOSTED,
  DEPLOYMENT_API_KEY: process.env.DEPLOYMENT_API_KEY,
  PORT: process.env.PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  RAW_MINIO_URL: process.env.RAW_MINIO_URL,
  COUCH_DB_USERNAME: process.env.COUCH_DB_USERNAME,
  COUCH_DB_PASSWORD: process.env.COUCH_DB_PASSWORD,
  RAW_COUCH_DB_URL: process.env.RAW_COUCH_DB_URL,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
}
