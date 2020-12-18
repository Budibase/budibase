module.exports = {
  SELF_HOSTED: process.env.SELF_HOSTED,
  WORKER_API_KEY: process.env.WORKER_API_KEY,
  PORT: process.env.PORT,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
  COUCH_DB_USERNAME: process.env.COUCH_DB_USERNAME,
  COUCH_DB_PASSWORD: process.env.COUCH_DB_PASSWORD,
  RAW_COUCH_DB_URL: process.env.RAW_COUCH_DB_URL,
  RAW_MINIO_URL: process.env.RAW_MINIO_URL,
  COUCH_DB_PORT: process.env.COUCH_DB_PORT,
  MINIO_PORT: process.env.MINIO_PORT,
  _set(key, value) {
    process.env[key] = value
    module.exports[key] = value
  },
}
