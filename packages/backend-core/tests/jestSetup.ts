import env from "../src/environment"

const globalSafe = global as any

console.error(global)

env._set(
  "COUCH_DB_PORT",
  globalSafe["__TESTCONTAINERS_COUCHDB-SERVICE-1_PORT_5984__"]
)
env._set(
  "COUCH_DB_URL",
  `http://${globalSafe["__TESTCONTAINERS_COUCHDB-SERVICE-1_IP__"]}:${globalSafe["__TESTCONTAINERS_COUCHDB-SERVICE-1_PORT_5984__"]}`
)
env._set(
  "MINIO_URL",
  `http://${globalSafe["__TESTCONTAINERS_MINIO-SERVICE-1_IP__"]}:${globalSafe["__TESTCONTAINERS_MINIO-SERVICE-1_PORT_9000__"]}`
)
