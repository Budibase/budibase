import env from "../environment"
import { env as coreEnv } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const tk = require("timekeeper")
tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.DEBUG) {
  global.console.log = jest.fn() // console.log are ignored in tests
  global.console.warn = jest.fn() // console.warn are ignored in tests
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

overrideConfigValue("COUCH_DB_PORT", global.__TESTCONTAINERS_DEVENV_PORT_5984__)
overrideConfigValue(
  "COUCH_DB_URL",
  `http://${global.__TESTCONTAINERS_DEVENV_IP__}:${global.__TESTCONTAINERS_DEVENV_PORT_5984__}`
)

overrideConfigValue(
  "MINIO_URL",
  `http://${global.__TESTCONTAINERS_DEVENV_IP__}:${global.__TESTCONTAINERS_DEVENV_PORT_9000__}`
)
