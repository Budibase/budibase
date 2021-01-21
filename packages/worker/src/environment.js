module.exports = {
  SELF_HOSTED: process.env.SELF_HOSTED,
  PORT: process.env.PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  RAW_MINIO_URL: process.env.RAW_MINIO_URL,
  MINIO_PORT: process.env.MINIO_PORT,
  SELF_HOST_KEY: process.env.SELF_HOST_KEY,
  COUCH_DB_USERNAME: process.env.COUCH_DB_USERNAME,
  COUCH_DB_PASSWORD: process.env.COUCH_DB_PASSWORD,
  COUCH_DB_URL: process.env.COUCH_DB_URL,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
}
