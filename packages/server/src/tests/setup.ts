import { tmpdir } from "os"
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers"
// import { timers } from "@budibase/backend-core"

let couchdb: StartedTestContainer

export async function setup() {
  process.env.SELF_HOSTED = "1"
  process.env.NODE_ENV = "jest"
  process.env.MULTI_TENANCY = "1"
  process.env.BUDIBASE_DIR = tmpdir()
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error"
  process.env.MOCK_REDIS = "1"
  process.env.PLATFORM_URL = "http://localhost:10000"
  process.env.REDIS_PASSWORD = "budibase"
  process.env.BUDIBASE_VERSION = "0.0.0+jest"
  process.env.JWT_SECRET = "testsecret"

  const couchdb = await new GenericContainer("budibase/couchdb")
    .withExposedPorts(5984)
    .withEnvironment({ COUCHDB_PASSWORD: "budibase", COUCHDB_USER: "budibase" })
    .withWaitStrategy(Wait.forListeningPorts().withStartupTimeout(20 * 1000))
    .withName("test-couchdb")
    .withReuse()
    .start()

  process.env.COUCH_DB_URL = `http://budibase:budibase@localhost:${couchdb.getMappedPort(
    5984
  )}`
}

export async function teardown() {
  if (couchdb) {
    await couchdb.stop()
  }
  // timers.cleanup()
}
