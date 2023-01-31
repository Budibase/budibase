import { mocks } from "@budibase/backend-core/tests"

import env from "../environment"
import { env as coreEnv } from "@budibase/backend-core"

// must explicitly enable fetch mock
mocks.fetch.enable()

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const tk = require("timekeeper")
tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.DEBUG) {
  global.console.log = jest.fn() // console.log are ignored in tests
}

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100000)
}

function overrideConfigValue(key: string, value: string) {
  env._set(key, value)
  coreEnv._set(key, value)
}

const globalSafe = global as any

console.log(global)

overrideConfigValue(
  "COUCH_DB_PORT",
  globalSafe["__TESTCONTAINERS_COUCHDB-SERVICE-1_PORT_5984__"]
)
overrideConfigValue(
  "COUCH_DB_URL",
  `http://${globalSafe["__TESTCONTAINERS_COUCHDB-SERVICE-1_IP__"]}:${globalSafe["__TESTCONTAINERS_COUCHDB-SERVICE-1_PORT_5984__"]}`
)

overrideConfigValue(
  "MINIO_URL",
  `http://${globalSafe["__TESTCONTAINERS_MINIO-SERVICE-1_IP__"]}:${globalSafe["__TESTCONTAINERS_MINIO-SERVICE-1_PORT_9000__"]}`
)
